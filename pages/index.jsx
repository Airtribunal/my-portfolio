import Link from "next/link";
import { nanoid } from "nanoid";
import { useState } from "react";
import { SyncLoader } from "react-spinners";
import { useInView } from "react-intersection-observer";

import Info from "./components/Info";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import About from "./components/About";
import Contact from "./components/Contact";
import ProjectCard from "./components/ProjectCard";
import Footer from "./components/Footer";

export async function getStaticProps() {
  const projectsResp = await fetch("http://localhost:8889/api/projects");
  const infoResp = await fetch("http://localhost:8889/api/info?populate=*");
  const aboutResp = await fetch("http://localhost:8889/api/about");
  // const infoImg = await fetch(`http://localhost:8889${infoResp.data.attributes.infoImg.data.attributes.url}`);

  return {
    props: {
      data: await projectsResp.json(),
      info: await infoResp.json(),
      about: await aboutResp.json(),
    },
    revalidate: 40,
  };
}

export default function Home({ data, info, about }) {
  // Info
  const infoName = info.data.attributes.infoName;
  const infoJob = info.data.attributes.infoJob;

  // Projects
  const projectsArray = data.data.map((project) => {
    return (
      <ProjectCard
        key={project.id}
        title={project.attributes.projectTitle}
        description={project.attributes.projectDescription}
        link={project.attributes.projectLink}
      />
    );
  });

  // About
  const aboutText = about.data.attributes.aboutDescription;
  const { ref: aboutRef, inView: aboutInView } = useInView({
    triggerOnce: true,
  });

  // Handle Mobile Navigation
  const [isActiveNav, setIsActiveNav] = useState(false);

  function handleActiveNav() {
    setIsActiveNav((prevIsActive) => !prevIsActive);
  }

  function handleNavClosing() {
    if (isActiveNav) {
      setTimeout(() => {
        setIsActiveNav(false);
      }, 600);
    }
  }

  // Navigation Links
  const navigation = [
    { name: "home", to: "/" },
    { name: "projects", to: "/#projects" },
    { name: "about", to: "#about" },
    { name: "contact", to: "#contact" },
  ];

  const navLinks = navigation.map((navLink) => {
    return (
      <li key={nanoid()}>
        <Link className="nav-link" href={navLink.to} onClick={handleNavClosing}>
          {navLink.name}
        </Link>
      </li>
    );
  });

  // Skills
  const skills = [
    { name: "HTML" },
    { name: "NextJs" },
    { name: "CSS/SCSS" },
    { name: "Strapi" },
    { name: "Javascript" },
    { name: "Git" },
    { name: "React" },
  ];

  let skillsArray = skills.map((skill) => {
    return (
      <div key={nanoid()} className="skill">
        <h4>{skill.name}</h4>
      </div>
    );
  });

  const { ref: refSkill, inView: inViewSkill } = useInView({
    triggerOnce: true,
  });

  // Contact
  const { ref: refContact, inView: inViewContact } = useInView({
    triggerOnce: true,
  });

  return (
    <>
      <header className="header">
        <Navbar
          isActive={isActiveNav}
          handleNav={handleActiveNav}
          handleNavClosing={handleNavClosing}
          navList={navLinks}
        />
      </header>
      <main className="container">
        <Info name={infoName} job={infoJob} />
        <Skills
          inViewSkill={inViewSkill}
          refSkill={refSkill}
          skillsArray={skillsArray}
        />
        <Projects projectsArray={projectsArray} />
        <About
          aboutRef={aboutRef}
          aboutInView={aboutInView}
          aboutText={aboutText}
        />
        <Contact refContact={refContact} inViewContact={inViewContact} />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
