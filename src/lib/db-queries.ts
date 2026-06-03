// src/lib/db-queries.ts
import { supabase } from "@/lib/supabase";

// Fetch all questions for a specific course
export async function fetchQuestionsByCourse(courseId: string) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('course_id', courseId)
    .order('set_number', { ascending: true }); // Sorts by PQ 1, 2, 3...

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
  
  // Mapping the database 'answer_index' back to your 'answerIndex'
  return data.map((q) => ({
    ...q,
    answerIndex: q.answer_index,
  }));
}

// Fetch only the unique set numbers available for a course
export async function fetchAvailableSets(courseId: string) {
  console.log("Fetching sets for courseId:", courseId); // Debugging
  
  const { data, error } = await supabase
    .from('questions')
    .select('set_number')
    .eq('course_id', courseId);
    
  if (error) {
    console.error("Supabase Error:", error);
    return [];
  }
  
  console.log("Raw data from Supabase:", data); // Debugging
  
  if (!data || data.length === 0) {
    console.warn("No questions found for this course in the database.");
    return [];
  }

  const sets = Array.from(new Set(data.map((q) => q.set_number)));
  return sets.sort((a, b) => a - b);
}