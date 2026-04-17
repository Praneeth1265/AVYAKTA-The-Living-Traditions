import RecruitmentForm from "@/components/forms/RecruitmentForm";
import bgImage from "@/components/forms/bg.jpeg";
import bgFormsImage from "@/components/forms/bg-forms.jpeg";
import "./recruitment.css";

export default function RecruitmentPage() {
  return (
    <main
      className="recruitment-page"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
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

        <RecruitmentForm bgImage={bgFormsImage.src} />
      </div>
    </main>
  );
}
