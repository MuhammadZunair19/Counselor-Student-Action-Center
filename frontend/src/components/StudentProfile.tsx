import type { ActionCenterResponse } from "../types";
import { Badge } from "./Badge";

interface StudentProfileProps {
    data: ActionCenterResponse;
}

export function StudentProfile({ data }: StudentProfileProps) {
    const { student, unreadMessageCount, urgencyLevel } = data;
    const enrollmentVariant =
        student.enrollmentStatus === "at_risk" ? "enrollment-at-risk" : "enrollment-active";

    return (
        <section className="card profile-card" aria-labelledby="profile-heading">
            <div className="profile-card__header">
                <div>
                    <h2 id="profile-heading">{student.name}</h2>
                    <p className="profile-card__email">{student.email}</p>
                </div>
                <Badge variant={urgencyLevel} />
            </div>

            <dl className="profile-card__stats">
                <div>
                    <dt>Grade</dt>
                    <dd>{student.grade}</dd>
                </div>
                <div>
                    <dt>GPA</dt>
                    <dd>{student.gpa.toFixed(1)}</dd>
                </div>
                <div>
                    <dt>Enrollment</dt>
                    <dd>
                        <Badge variant={enrollmentVariant} />
                    </dd>
                </div>
                <div>
                    <dt>Unread messages</dt>
                    <dd className={unreadMessageCount > 0 ? "stat-highlight" : undefined}>
                        {unreadMessageCount}
                    </dd>
                </div>
            </dl>
        </section>
    );
}
