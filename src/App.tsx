
import { useState } from "react";
import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";
import ModulePage from "./pages/ModulePage";

export type Screen =
  | "home"
  | "course"
  | "modules"
  | "search";

export interface Course {
  id: number;
  name: string;
  code: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setScreen("course");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {screen === "home" && (
        <HomePage onSelectCourse={openCourse} />
      )}

      {screen === "course" && selectedCourse && (
        <CoursePage
          course={selectedCourse}
          onBack={() => setScreen("home")}
          onOpenModules={() => setScreen("modules")}
          onSearch={() => setScreen("search")}
        />
      )}

      {screen === "modules" && selectedCourse && (
        <ModulePage
          course={selectedCourse}
          onBack={() => setScreen("course")}
        />
      )}

    </div>
  );
}
