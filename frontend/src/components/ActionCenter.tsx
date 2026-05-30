import { useState } from "react";
import { useActionCenter } from "../hooks/useActionCenter";
import { STUDENT_OPTIONS } from "../types";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { StudentProfile } from "./StudentProfile";
import { TaskList } from "./TaskList";

export function ActionCenter() {
    const [studentId, setStudentId] = useState<string>(STUDENT_OPTIONS[0].id);
    const {
        data,
        loading,
        error,
        updatingTaskId,
        updateError,
        clearUpdateError,
        refetch,
        handleStatusChange,
    } = useActionCenter(studentId);

    return (
        <div className="app">
            <header className="app-header">
                <div>
                    <p className="app-header__eyebrow">Zyra Counselor</p>
                    <h1>Student Action Center</h1>
                </div>

                <label className="student-select">
                    <span>Student</span>
                    <select
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        disabled={loading && !data}
                    >
                        {STUDENT_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </label>
            </header>

            <main className="app-main">
                {loading && <LoadingState />}

                {!loading && error && <ErrorState message={error} onRetry={refetch} />}

                {!loading && !error && data && (
                    <>
                        {updateError && (
                            <div className="banner banner--error" role="alert">
                                <p>{updateError}</p>
                                <button
                                    type="button"
                                    className="banner__dismiss"
                                    onClick={clearUpdateError}
                                    aria-label="Dismiss"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <StudentProfile data={data} />
                        <TaskList
                            tasks={data.tasks}
                            updatingTaskId={updatingTaskId}
                            onStatusChange={handleStatusChange}
                        />
                    </>
                )}
            </main>
        </div>
    );
}
