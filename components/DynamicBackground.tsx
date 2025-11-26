import React, { useEffect, useRef } from 'react';
import { WeatherCondition } from '../types';

interface DynamicBackgroundProps {
  condition: WeatherCondition;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ condition }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Starry Background (Default)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || condition !== WeatherCondition.STARRY) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; radius: number; alpha: number; velocity: number }[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        velocity: Math.random() * 0.05
      });
    }

    const animate = () => {
      if (condition !== WeatherCondition.STARRY) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.alpha += star.velocity;
        if (star.alpha > 1 || star.alpha < 0) star.velocity = -star.velocity;
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [condition]);

  // Rain Effect
  const renderRain = () => {
    const drops = [];
    for (let i = 0; i < 50; i++) {
      const delay = Math.random() * 2;
      const left = Math.random() * 100;
      drops.push(
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${0.5 + Math.random()}s`
          }}
        />
      );
    }
    return <div className="absolute inset-0 overflow-hidden pointer-events-none">{drops}</div>;
  };

  // Background Gradients
  const getGradient = () => {
    switch (condition) {
      case WeatherCondition.CLEAR:
        return 'bg-gradient-to-b from-blue-400 to-blue-200';
      case WeatherCondition.RAIN:
        return 'bg-gradient-to-b from-gray-900 to-gray-700';
      case WeatherCondition.CLOUDS:
        return 'bg-gradient-to-b from-gray-400 to-gray-200';
      case WeatherCondition.STARRY:
      default:
        return 'bg-black'; // Base for canvas
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ${getGradient()}`}>
      
      {/* Starry Night Canvas */}
      {condition === WeatherCondition.STARRY && (
        <canvas ref={canvasRef} className="absolute inset-0" />
      )}

      {/* Sun / Clear */}
      {condition === WeatherCondition.CLEAR && (
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-80 animate-pulse" />
      )}

      {/* Rain Animation */}
      {condition === WeatherCondition.RAIN && renderRain()}

      {/* Clouds Animation */}
      {(condition === WeatherCondition.CLOUDS || condition === WeatherCondition.RAIN) && (
        <>
           <div className="absolute top-20 left-10 w-48 h-16 bg-white/20 blur-xl rounded-full animate-float" style={{ animationDuration: '8s' }} />
           <div className="absolute top-40 right-20 w-64 h-24 bg-white/30 blur-xl rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        </>
      )}
    </div>
  );
};

export default DynamicBackground;