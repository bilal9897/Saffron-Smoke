import EmberLoader from "./components/EmberLoader";
import CourseRail from "./components/CourseRail";
import HeroPlating from "./components/HeroPlating";
import TastingJourney from "./components/TastingJourney";
import TandoorFire from "./components/TandoorFire";
import ShankDetail from "./components/ShankDetail";
import PairingSheet from "./components/PairingSheet";
import ReserveTable from "./components/ReserveTable";
import FireFooter from "./components/FireFooter";
import Handovers from "./components/Handovers";

/**
 * Saffron & Smoke: 8 parts (site/DESIGN.md). Loader · Hero · Tasting journey · Tandoor fire · Signature dish ·
 * Pairing · Reservations · Footer, with the course rail over all of them. Desktop only (1440×900).
 * Record timeline ≈ 29.4 s after the 2 s loader: hero 7.5 · tasting 7.4 · fire 4.0 · shank 3.0 · pairing 2.5 ·
 * reserve 3.0 · footer 2.0 (numbers live on the sections' data-record-* attributes and in content.ts).
 */
export default function Page() {
  return (
    <>
      <EmberLoader />
      <CourseRail />
      <main className="ss-page">
        <HeroPlating />
        <TastingJourney />
        <TandoorFire />
        <ShankDetail />
        <PairingSheet />
        <ReserveTable />
      </main>
      <FireFooter />
      <Handovers />
      <div className="firelight" aria-hidden />
    </>
  );
}
