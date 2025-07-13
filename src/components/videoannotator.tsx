import '../estilos/VideoAnnotator.css'; 
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import jsPDF from 'jspdf';
import React, { useState } from 'react';

const formatTime = (time: number) => {
  return new Date(time * 1000).toISOString().substr(11, 8);
};

const Videoannotator = () => {
  const [annotationText, setAnnotationText] = React.useState('');
  const [annotations, setAnnotations] = React.useState<{ time: number, text: string }[]>([]);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editText, setEditText] = React.useState('');
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const handleAddAnnotation = () => {
    if (!videoRef) return;
    const currentTime = videoRef.currentTime;
    setAnnotations([...annotations, { time: currentTime, text: annotationText }]);
    setAnnotationText('');
  };

  const handleEditAnnotation = (index: number) => {
    setEditingIndex(index);
    setEditText(annotations[index].text);
  };

  const handleSaveEdit = (index: number) => {
    const updatedAnnotations = annotations.map((annotation, i) =>
      i === index ? { ...annotation, text: editText } : annotation
    );
    setAnnotations(updatedAnnotations);
    setEditingIndex(null);
  };

  const handleDeleteAnnotation = (index: number) => {
    const updatedAnnotations = annotations.filter((_, i) => i !== index);
    setAnnotations(updatedAnnotations);
  };

  const geratedPDF = () => {
    const doc = new jsPDF();
    annotations.forEach((annotation, index) => {
      const timeFormatted = new Date(annotation.time * 1000).toISOString().substr(11, 8);
      doc.text(`Anotação ${index + 1}: [${timeFormatted}] ${annotation.text}`, 10, 10 + index * 10);
    });
    doc.save('annotations.pdf');
  };

  return (
    <div className="container">
      <h1>Laudo de Videonasofibrolaringoscopia</h1>

      <CustomVideoPlayer onVideoReady={setVideoRef} />

      <div className="annotation-controls">
        <input
          type="text"
          value={annotationText}
          onChange={e => setAnnotationText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddAnnotation();
            }
          }}
          placeholder="Digite sua anotação aqui"
        />
        <button onClick={handleAddAnnotation}>✍️ Observações</button>
        <button onClick={geratedPDF}>📄 Gerar PDF</button>
      </div>

      <div className="annotation-list">
        {annotations.map((a, i) => (
          <div key={i} className="annotation-item">
            <strong>{formatTime(a.time)}</strong>: 
            
            {editingIndex === i ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleSaveEdit(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit(i);
                  }
                }}
                autoFocus
              />
            ) : (
              <span>{a.text}</span>
            )}
            
            {editingIndex === i ? (
              <button onClick={() => handleSaveEdit(i)}>💾 </button>
            ) : (
              <button onClick={() => handleEditAnnotation(i)}>✏️ </button>
            )}
            
            <button onClick={() => handleDeleteAnnotation(i)}>🗑️ </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videoannotator;