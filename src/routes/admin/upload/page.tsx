"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { extractQuestionWithAI } from "@/lib/api/serverFunctions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, UploadCloud, Trash2, Save, Plus } from "lucide-react";
import { QuestionCard } from "@/components/instrict/QuestionCard";
import { C } from '@/data/instrict';
import { supabase } from "@/lib/supabase";

const questionSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  solution: z.string().min(1, "Solution is required"),
  type: z.enum(["objective", "theory", "fill-in-the-gap"]),
  formula: z.string().optional(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

const adminFormSchema = z.object({
  courseId: z.string().min(1),
  questions: z.array(questionSchema),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

export const Route = createFileRoute("/admin/upload/page")({
  component: AdminUploadPage,
});

function AdminUploadPage() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [setNumber, setSetNumber] = useState<number>(1);

  const allCourses = Object.values(C);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: { courseId: allCourses[0]?.code || "", questions: [] },
  });

  const { fields, replace, remove, update, append } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleAddNew = () => {
    append({
      prompt: "",
      solution: "",
      type: "objective", // Default to objective to show options
      options: ["", "", "", ""], // Pre-fill 4 empty options
      answer: "",
      formula: "",
    });
  };

  const handleSaveToSupabase = async (data: AdminFormValues) => {
    setIsSaving(true);
    try {
      const payload = data.questions.map((q) => ({
        course_id: data.courseId,
        prompt: q.prompt,
        solution: q.solution,
        type: q.type,
        options: q.options,
        answer: q.answer,
        formula: q.formula,
        set_number: setNumber,
      }));

      const { error } = await supabase.from('questions').insert(payload);
      if (error) throw error;

      alert(`Successfully saved as Set PQ ${setNumber}!`);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving questions to Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIExtract = async () => {
    if (!uploadedFile) return;
    setIsExtracting(true);
    try {
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(uploadedFile);
      });

      const extracted = await extractQuestionWithAI({
        data: { base64Data, mimeType: uploadedFile.type },
      });

      const formatted = (Array.isArray(extracted) ? extracted : [extracted]).map((q: any) => ({
        prompt: q.prompt || "",
        solution: q.solution || "",
        type: q.type || "theory",
        options: q.options || [],
        answer: q.answer || "",
        formula: q.formula || "",
      }));
      
      replace(formatted);
    } catch (err) {
      console.error("Extraction error:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      <div className="flex justify-between items-center">
        <h1 className="text-md md:text-3xl font-bold">Content Ingestion Panel</h1>
        {fields.length > 0 && (
          <Button onClick={form.handleSubmit(handleSaveToSupabase)} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save Set PQ {setNumber}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 rounded-2xl border p-6 bg-muted/20 h-fit">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase">Select Course</label>
              <select className="w-full p-2 border rounded mt-1 bg-background" {...form.register("courseId")}>
                {allCourses.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Set Number</label>
              <Input type="number" value={setNumber} onChange={(e) => setSetNumber(Number(e.target.value))} className="mt-1" />
            </div>
            
            <UploadCloud className="h-8 w-8 mx-auto text-primary" />
            <input type="file" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} />
            
            {uploadedFile && (
              <Button onClick={handleAIExtract} disabled={isExtracting} className="w-full">
                {isExtracting ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />} 
                Extract Data
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full border-dashed" onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Manual Question
          </Button>

          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-2xl  bg-background relative space-y-4">
              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              
              <select 
                value={field.type} 
                className="text-xs font-bold uppercase p-1 border rounded bg-transparent md:w-[30%] w-[50%]"
                onChange={(e) => {
                  const newType = e.target.value as any;
                  update(index, { 
                    ...field, 
                    type: newType,
                    options: newType === "objective" ? (field.options?.length ? field.options : ["", "", "", ""]) : [] 
                  });
                }}
              >
                <option value="objective">Objective</option>
                <option value="theory">Theory</option>
                <option value="fill-in-the-gap">Fill-in-the-gap</option>
              </select>

              <QuestionCard
                question={field as any}
                index={index}
                onPromptChange={(val) => update(index, { ...field, prompt: val })}
                onSolutionChange={(val) => update(index, { ...field, solution: val })}
                onOptionChange={(optIdx, val) => {
                  const newOptions = [...(field.options || [])];
                  newOptions[optIdx] = val;
                  update(index, { ...field, options: newOptions });
                }}
                onAnswerChange={(val) => update(index, { ...field, answer: val })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}