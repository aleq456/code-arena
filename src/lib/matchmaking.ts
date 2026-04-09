import { supabase } from "./supabase"

export async function findOrCreateDuel(userId: string): Promise<{
  duelId: string
  problem: any
  isNewDuel: boolean
}> {
  console.log("🔍 Looking for waiting duels for user:", userId)

  const { data: waitingDuels } = await supabase
    .from("duels")
    .select("*")
    .eq("status", "waiting")
    .neq("player1_id", userId)
    .limit(1)

  const waitingDuel = waitingDuels?.[0] || null

  if (waitingDuel) {
    console.log("✅ Joining existing duel:", waitingDuel.id)

    const { data: updatedDuel } = await supabase
      .from("duels")
      .update({ player2_id: userId, status: "active" })
      .eq("id", waitingDuel.id)
      .select()
      .single()

    const { data: problem } = await supabase
      .from("problems")
      .select("*")
      .eq("id", updatedDuel!.problem_id)
      .single()

    return { duelId: updatedDuel!.id, problem, isNewDuel: false }
  }

  console.log("🎯 Picking random problem...")

  // Pick a random problem from our database
  const { data: problems } = await supabase
    .from("problems")
    .select("*")

  if (!problems || problems.length === 0) throw new Error("No problems available")

  const problem = problems[Math.floor(Math.random() * problems.length)]

  const { data: newDuel } = await supabase
    .from("duels")
    .insert({
      player1_id: userId,
      problem_id: problem.id,
      status: "waiting"
    })
    .select()
    .single()

  console.log("🆕 New duel created:", newDuel!.id)

  return { duelId: newDuel!.id, problem, isNewDuel: true }
}
