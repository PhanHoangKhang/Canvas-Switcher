export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  workflow_state: string;
  start_at: string | null;
  end_at: string | null;
}

export interface Course {
  id: number;
  name: string;
  code: string;
}