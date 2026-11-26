
import { useCallback, useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";
import ModulePage from "./pages/ModulePage";

import LoginPage from "./components/LoginPage";
import LoadingPage from "./components/LoadingPage";
import RefreshButton from "./components/RefreshButton";

import { getCourses } from "./services/courseService";

export type Screen = "home" | "course" | "modules";
export type AppState = "loading" | "login" | "authenticated";

export interface Course {
  id: number;
  name: string;
  code: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const [isChecking, setIsChecking] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const checkCanvasSession = useCallback(async () => {
    try {
      await getCourses();
      setAppState("authenticated");
    } catch (error) {
      setSessionError(
        error instanceof Error ? error.message : "Unable to load Canvas courses.",
      );
      setAppState("login");
    } finally {
      setIsChecking(false);
    }
  }, []);

  const refreshCanvasSession = useCallback(() => {
    setIsChecking(true);
    setSessionError(null);
    setAppState("loading");
    void checkCanvasSession();
  }, [checkCanvasSession]);

  useEffect(() => {
    void checkCanvasSession();
  }, [checkCanvasSession]);

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setScreen("course");
  };

  // Initial session check
  if (appState === "loading") {
    return <LoadingPage />;
  }

  // Shared application layout
  return (
    <div className="relative min-h-screen bg-background text-text-primary">
      {/* Shared refresh button */}
      <div className="absolute right-3 top-3 z-50">
        <RefreshButton
          onClick={refreshCanvasSession}
          isLoading={isChecking}
        />
      </div>

      {/* Login fallback */}
      {appState === "login" && <LoginPage error={sessionError} />}

      {/* Main application */}
      {appState === "authenticated" && (
        <>
          {screen === "home" && (
            <HomePage onSelectCourse={openCourse} />
          )}

          {screen === "course" && selectedCourse && (
            <CoursePage
              course={selectedCourse}
              onBack={() => setScreen("home")}
              onOpenModules={() => setScreen("modules")}
              onSearch={() => {}}
            />
          )}

          {screen === "modules" && selectedCourse && (
            <ModulePage
              course={selectedCourse}
              onBack={() => setScreen("course")}
            />
          )}
        </>
      )}
    </div>
  );
}
