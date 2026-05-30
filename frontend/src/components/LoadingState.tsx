export function LoadingState() {
    return (
        <div className="state-panel" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>Loading student action center…</p>
        </div>
    );
}
