import RegistrationAvailableClient from "@/components/registrations/RegistrationAvailableClient";

export const metadata = {
  title: "Event Registrations",
  description: "Register for events that are currently open",
};

export default function RegistrationsPage() {
  return <RegistrationAvailableClient />;
}
