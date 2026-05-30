import { useCallback, useEffect, useState } from "react";
import { fetchActionCenter, updateTaskStatus } from "../api/client";
import type { ActionCenterResponse, TaskStatus } from "../types";

interface UseActionCenterResult {
    data: ActionCenterResponse | null;
    loading: boolean;
    error: string | null;
    updatingTaskId: string | null;
    updateError: string | null;
    clearUpdateError: () => void;
    refetch: () => void;
    handleStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
}

export function useActionCenter(studentId: string): UseActionCenterResult {
    const [data, setData] = useState<ActionCenterResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchActionCenter(studentId);
            setData(result);
        } catch (err) {
            setData(null);
            setError(err instanceof Error ? err.message : "Failed to load action center");
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        load();
    }, [load]);

    const handleStatusChange = useCallback(
        async (taskId: string, status: TaskStatus) => {
            setUpdatingTaskId(taskId);
            setUpdateError(null);

            try {
                await updateTaskStatus(taskId, status);
                const refreshed = await fetchActionCenter(studentId);
                setData(refreshed);
            } catch (err) {
                setUpdateError(
                    err instanceof Error ? err.message : "Failed to update task status",
                );
            } finally {
                setUpdatingTaskId(null);
            }
        },
        [studentId],
    );

    return {
        data,
        loading,
        error,
        updatingTaskId,
        updateError,
        clearUpdateError: () => setUpdateError(null),
        refetch: load,
        handleStatusChange,
    };
}
