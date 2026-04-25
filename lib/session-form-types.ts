export type SessionFormState = {
  patientId: string;
  sessionDate: Date;
  emotionalState: string;
  axisEvaluation: string;
  sessionContent: string;
  clinicalHypothesis: string;
  interventions: string;
  objectiveProgress: string;
  keyIdeas: string;
  nextSessionPlan: string;
  sessionSummary: string;
  homeworkOrTasks: string;
  observations: string;
};

export type StoredSessionDraft = {
  patient_id: string;
  session_date: string;
  emotional_state: string;
  axis_evaluation: string;
  session_content: string;
  clinical_hypothesis: string;
  interventions: string;
  objective_progress: string;
  key_ideas: string;
  next_session_plan: string;
  session_summary: string;
  homework_or_tasks: string;
  observations: string;
  saved_at: string;
};
