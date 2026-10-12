import { useState } from "react";
import {
  PageBanner,
  ProgramCard,
  QuoteMarquee,
} from "../components/sections.jsx";
import { SectionHead } from "../components/ui.jsx";
import { useContent } from "../cms/ContentContext.jsx";

export default function Programs() {
  const { content } = useContent();
  const cats = ["All", ...new Set(content.programs.map((p) => p.category))];
  const [cat, setCat] = useState("All");
  const shown =
    cat === "All"
      ? content.programs
      : content.programs.filter((p) => p.category === cat);
  return (
    <>
      <PageBanner
        title='What We Do'
        text='Health, socio-economic empowerment, and sustainability and development — delivered with a hands-on approach.'
        image='/images/green-5094.jpg'
        crumbs={[{ label: "What We Do" }]}
      />
      <section className='section'>
        <div className='container'>
          <SectionHead
            center
            kicker='Our Programs'
            title='Smart, Tailored,'
            em='Solutions'
            lead='“Empowerment starts the moment people recognize their own power — and are supported to act on it.”'
          />
          <div
            className='tabs'
            style={{ justifyContent: "center", marginTop: 36 }}
          >
            {cats.map((c) => (
              <button
                key={c}
                className={cat === c ? "on" : ""}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className='cards'>
            {shown.map((p, i) => (
              <ProgramCard key={p.id} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>
      <QuoteMarquee />
    </>
  );
}
