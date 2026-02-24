import React, { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
    const blobsRef = useRef([]);
    const glassRef = useRef([]);

    useEffect(() => {
        let mouseX = 0;
        let mouseY = 0;
        let scrollY = 0;
        let currentX = 0;
        let currentY = 0;
        let currentScroll = 0;
        let frameId;

        const handleMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        };

        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        const updateElements = () => {
            // Speed settings for smooth interpolation
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            currentScroll += (scrollY - currentScroll) * 0.1;

            // Update Blobs (Parallax + Mouse)
            blobsRef.current.forEach((blob, i) => {
                if (!blob) return;
                const speed = (i + 1) * 30;
                const scrollSpeed = (i + 1) * -0.2;
                blob.style.transform = `translate3d(${currentX * speed}px, ${currentY * speed + currentScroll * scrollSpeed}px, 0)`;
            });

            // Update Glass Objects (Rotation + Parallax + Scroll)
            glassRef.current.forEach((glass, i) => {
                if (!glass) return;
                const speed = 80 + i * 40;
                const scrollSpeed = (i + 1) * -0.5;
                const rotX = currentY * -25;
                const rotY = currentX * 25;

                // Add vertical shift based on scroll
                const yOffset = currentScroll * scrollSpeed;

                glass.style.transform = `translate3d(${currentX * speed}px, ${currentY * speed + yOffset}px, 150px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${12 + i * 8}deg)`;
            });

            frameId = requestAnimationFrame(updateElements);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        frameId = requestAnimationFrame(updateElements);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(frameId);
        };
    }, []);

    const blobs = [
        { size: 'w-[700px] h-[700px]', color: 'bg-indigo-600/10', top: '5%', left: '-10%', blur: 'blur-[150px]' },
        { size: 'w-[800px] h-[800px]', color: 'bg-purple-600/10', top: '40%', left: '30%', blur: 'blur-[180px]' },
        { size: 'w-[600px] h-[600px]', color: 'bg-blue-500/05', top: '15%', left: '75%', blur: 'blur-[120px]' },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#020617]" style={{ perspective: '1500px' }}>
            {/* Background Blobs */}
            {blobs.map((blob, i) => (
                <div
                    key={i}
                    ref={el => blobsRef.current[i] = el}
                    className={`absolute rounded-full ${blob.size} ${blob.color} ${blob.blur} will-change-transform no-transition`}
                    style={{
                        top: blob.top,
                        left: blob.left,
                        transform: 'translate3d(0,0,0)'
                    }}
                />
            ))}

            {/* 3D Glass Objects */}
            <div
                ref={el => glassRef.current[0] = el}
                className="absolute top-[25%] right-[10%] w-72 h-72 glass-card-premium rounded-[3.5rem] opacity-30 hidden lg:block will-change-transform no-transition"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[3.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.6)]"></div>
            </div>

            <div
                ref={el => glassRef.current[1] = el}
                className="absolute top-[60%] left-[5%] w-48 h-48 glass-card-premium rounded-[2.5rem] opacity-20 hidden lg:block will-change-transform no-transition"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)]"></div>
            </div>

            {/* Grain/Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay pointer-events-none"></div>
        </div>
    );
};

export default InteractiveBackground;
