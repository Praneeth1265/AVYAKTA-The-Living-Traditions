import RecruitmentForm from "@/components/forms/RecruitmentForm";
import "./recruitment.css";

export default function RecruitmentPage() {
  return (
    <main className="recruitment-page">
      <div className="recruitment-inner">
        <div className="recruitment-header">
          <h1 className="recruitment-title">Join Avyakta</h1>
          <p className="recruitment-subtitle">
            Discover your passion, grow with our community, and lead cultural
            innovation
          </p>
        </div>

        <div className="rangoli-divider">
          <div className="rangoli-symbol"></div>
        </div>

        <RecruitmentForm />
      </div>
    </main>
  );
}
