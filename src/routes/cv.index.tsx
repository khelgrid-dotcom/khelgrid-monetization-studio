import { createFileRoute, redirect } from "@tanstack/react-router";
import { loadSportsCVData } from "@/lib/sports-cv-storage";
import { slugifyAthleteName } from "@/lib/sports-cv-sharing";

export const Route = createFileRoute("/cv/")({
  beforeLoad: () => {
    try {
      const data = loadSportsCVData();
      const slug = slugifyAthleteName(data.athleteName, data.sport);
      throw redirect({
        to: "/cv/$id",
        params: { id: slug || "aarav-sharma-cricket" },
      });
    } catch (e) {
      if (e && typeof e === "object" && "to" in e) {
        throw e;
      }
      throw redirect({
        to: "/cv/$id",
        params: { id: "aarav-sharma-cricket" },
      });
    }
  },
  component: () => null,
});

export default Route;
