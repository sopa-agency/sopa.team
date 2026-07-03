import { AsciiWave } from './components/AsciiWave'
import { useLocation } from './router'
import { Home } from './pages/Home'
import { Pessoas } from './pages/Pessoas'
import { Perfil } from './pages/Perfil'
import { Feed } from './pages/Feed'
import { Projetos } from './pages/Projetos'
import { Capacidades } from './pages/Capacidades'
import { Contato } from './pages/Contato'
import { Post } from './pages/Post'

export function App() {
  const { route, param } = useLocation()

  return (
    <>
      <AsciiWave />
      {route === 'home' && <Home />}
      {route === 'pessoas' && <Pessoas />}
      {route === 'perfil' && <Perfil handle={param} />}
      {route === 'feed' && <Feed />}
      {route === 'projetos' && <Projetos />}
      {route === 'capacidades' && <Capacidades />}
      {route === 'contato' && <Contato />}
      {route === 'post' && <Post />}
    </>
  )
}
