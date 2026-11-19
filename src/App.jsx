import NavBar from './components/NavBar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Journey from './components/Journey.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import ChatWidget from './components/ChatWidget.jsx'


export default function App() {
  return (
    <div className="min-h-screen">
      <Cursor />
      <NavBar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
        <ChatWidget />
      </main>
      <Footer />
    </div>
  )
}