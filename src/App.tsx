import MatrixCam from './components/matrix-cam/MatrixCam.tsx';

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Matrix Cam</h1>
      </header>
      <section className="app-content">
        <MatrixCam />
      </section>
    </main>
  );
}
