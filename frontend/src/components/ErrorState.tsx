interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="state-panel state-panel--error" role="alert">
            <p className="state-panel__title">Something went wrong</p>
            <p className="state-panel__message">{message}</p>
            {onRetry && (
                <button type="button" className="btn btn--secondary" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    );
}
