import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { MainCanvas } from "@/components/MainCanvas";
import { OnboardingModal } from "@/components/OnboardingModal";
import { OutreachDrawer } from "@/components/OutreachDrawer";
import { GraphStateProvider } from "@/hooks/useGraphState";
import { OnboardingProvider } from "@/hooks/useOnboarding";
import { OutreachProvider } from "@/hooks/useOutreach";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Nexus — Network graph intelligence" },
      { name: "description", content: "Map your professional network, find warm paths into target companies, and generate outreach with AI." },
    ],
  }),
});

function Index() {
  return (
    <GraphStateProvider>
      <OnboardingProvider>
        <OutreachProvider>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <TopBar />
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <Sidebar />
              <MainCanvas />
            </div>
            <OutreachDrawer />
            <OnboardingModal />
          </div>
        </OutreachProvider>
      </OnboardingProvider>
    </GraphStateProvider>
  );
}
