
import React from "react";
import ReactPlayer from "react-player/youtube";

const videos = [
  {
    title: "1.Inicio de Sesion",
    url: "https://www.youtube.com/watch?v=QorybWsJPkg",
  },
  {
    title: "2.Tablero Principal",
    url: "https://www.youtube.com/watch?v=C-HrG73kGOg",
  },
  {
    title: "3.Menu Lateral",
    url: "https://www.youtube.com/watch?v=LlmJVIx94yM",
  },
   {
    title: "4.Crear Prodcutos ",
    url: "https://www.youtube.com/watch?v=D2nkNNrs3NM",
  },
  {
    title: "5.Crear Rcetas ",
    url: "https://www.youtube.com/watch?v=wj5VO8NMl5s",
  },
  {
    title: "6.Apertura de Caja ",
    url: "https://www.youtube.com/watch?v=AkwjSLFtn_c",
  },
  {
    title: "7.Gestion de Caja ",
    url: "https://www.youtube.com/watch?v=PzvWWryNszA",
  },
  {
    title: "8.Mesas y Ventas ",
    url: "https://www.youtube.com/watch?v=6Gbzyj7J0p8",
  },
];

const Tutoriales = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tutoriales Sobre Modulos  del Sistema</h1>

      <div className="space-y-8">
        {videos.map((video, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
            <ReactPlayer url={video.url} controls width="100%" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutoriales;
