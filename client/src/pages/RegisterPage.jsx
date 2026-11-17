import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

const ANCHOR_X = 245;
const ANCHOR_Y = 212;
const REST_X = 245;
const REST_Y = 300;
const MAX_STRETCH = 120;
const TRIGGER_PULL = 28;

const particleThemes = {
  amber: { fill: '255, 205, 120', glow: '255, 185, 80' },
  cyan: { fill: '140, 245, 255', glow: '0, 240, 255' },
  rose: { fill: '255, 160, 200', glow: '255, 51, 133' },
  mint: { fill: '160, 255, 200', glow: '0, 230, 118' },
  moonlight: { fill: '220, 235, 255', glow: '200, 220, 255' },
};

const RegisterPage = () => {
  const navigate = useNavigate();

  // Lamp state
  const [isOn, setIsOn] = useState(true);
  const [currentColor, setCurrentColor] = useState('amber');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [successOverlay, setSuccessOverlay] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const elasticCordRef = useRef(null);
  const cordBeadRef = useRef(null);
  const shadeAssemblyRef = useRef(null);
  const cardRef = useRef(null);
  const formStageRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Audio helper
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playPluckSound = () => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Audio fallback
    }
  };

  // Render elastic string
  const renderElasticString = (curX, curY) => {
    if (!elasticCordRef.current) return;
    const midX = (ANCHOR_X + curX) / 2;
    const midY = (ANCHOR_Y + curY) / 2;
    const stretchRatio = Math.max(1, (curY - ANCHOR_Y) / (REST_Y - ANCHOR_Y));
    const strokeWidth = Math.max(1.6, 2.6 / Math.sqrt(stretchRatio));
    elasticCordRef.current.setAttribute('d', `M ${ANCHOR_X} ${ANCHOR_Y} Q ${midX} ${midY} ${curX} ${curY}`);
    elasticCordRef.current.setAttribute('stroke-width', strokeWidth.toFixed(2));
  };

  // Toggle Lamp
  const toggleLamp = () => {
    playPluckSound();
    setIsOn((prev) => !prev);
  };

  // Pull cord dragging logic (via GSAP Draggable)
  useEffect(() => {
    const bead = cordBeadRef.current;
    if (!bead) return;

    renderElasticString(REST_X, REST_Y);

    if (window.gsap && window.Draggable) {
      window.gsap.registerPlugin(window.Draggable);
      window.gsap.set(bead, { x: REST_X, y: REST_Y });

      const draggableInstance = window.Draggable.create(bead, {
        type: 'x,y',
        bounds: {
          minY: REST_Y,
          maxY: REST_Y + MAX_STRETCH,
          minX: REST_X - 40,
          maxX: REST_X + 40,
        },
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress() {
          initAudio();
        },
        onDrag() {
          renderElasticString(this.x, this.y);
          const pullDist = this.y - REST_Y;
          const shadeTilt = (pullDist / MAX_STRETCH) * 2;
          if (shadeAssemblyRef.current) {
            window.gsap.set(shadeAssemblyRef.current, {
              rotation: shadeTilt,
              transformOrigin: '215px 175px',
            });
          }
        },
        onRelease() {
          const pullDist = this.y - REST_Y;
          if (pullDist >= TRIGGER_PULL) {
            toggleLamp();
          } else {
            playPluckSound();
          }
          window.gsap.to(bead, {
            x: REST_X,
            y: REST_Y,
            duration: 0.5,
            ease: 'elastic.out(1.2, 0.35)',
            onUpdate: () => renderElasticString(window.gsap.getProperty(bead, 'x'), window.gsap.getProperty(bead, 'y')),
          });
          if (shadeAssemblyRef.current) {
            window.gsap.to(shadeAssemblyRef.current, {
              rotation: 0,
              duration: 0.6,
              ease: 'elastic.out(1, 0.4)',
            });
          }
        },
      });

      return () => {
        if (draggableInstance && draggableInstance[0]) {
          draggableInstance[0].kill();
        }
      };
    }
  }, [soundEnabled]);

  // Floating Dust Canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.4) * 0.35,
        vy: -Math.random() * 0.4 - 0.15,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulse: Math.random() * Math.PI,
      });
    }

    const theme = particleThemes[currentColor] || particleThemes.amber;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentAlpha = (Math.sin(p.pulse) * 0.3 + 0.7) * p.alpha;
        const factor = isOn ? 1 : 0.08;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${theme.fill}, ${currentAlpha * factor})`;
        if (isOn) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${theme.glow}, 0.5)`;
        }
        ctx.fill();
        ctx.restore();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOn, currentColor]);

  // 3D Tilt on Mouse Move
  const handleMouseMove = (e) => {
    if (!isOn || !cardRef.current || !formStageRef.current) return;
    const rect = formStageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    if (window.gsap) {
      window.gsap.to(cardRef.current, {
        rotateX: -(y / rect.height) * 8,
        rotateY: (x / rect.width) * 8,
        duration: 0.4,
        ease: 'power1.out',
        transformPerspective: 900,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !window.gsap) return;
    window.gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  // Submit Register Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOn) {
      toggleLamp();
      return;
    }

    setAlert(null);

    // Validation
    if (password.length < 6) {
      setAlert({
        type: 'error',
        message: 'Mật khẩu phải có ít nhất 6 ký tự!',
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        type: 'error',
        message: 'Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại!',
      });
      return;
    }

    if (!agreeTerms) {
      setAlert({
        type: 'error',
        message: 'Vui lòng đồng ý với Điều khoản & Chính sách trước khi đăng ký!',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccessOverlay(true);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Đăng ký không thành công, vui lòng thử lại!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neon-auth-page" data-on={isOn ? 'true' : 'false'} data-color={currentColor}>
      {/* Nút trở về Trang chủ */}
      <Link to="/" className="back-home-btn" title="Quay lại trang chủ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Trang chủ</span>
      </Link>

      {/* Hiệu ứng Ambient Glow & Dust Particles */}
      <div className="ambient-glow"></div>
      <canvas ref={canvasRef} id="dustCanvas"></canvas>

      {/* Controls góc phải trên */}
      <div className="quick-controls">
        <div className="color-palette" title="Chọn màu đèn Neon">
          {['amber', 'cyan', 'rose', 'mint', 'moonlight'].map((col) => (
            <button
              key={col}
              className={`color-dot-btn ${currentColor === col ? 'active' : ''}`}
              data-color={col}
              onClick={() => setCurrentColor(col)}
              title={col}
            ></button>
          ))}
        </div>

        <button
          className="sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? (
            <svg className="sound-icon sound-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg className="sound-icon sound-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Khung cảnh chính */}
      <main className="scene-container">
        {/* Lamp Stage */}
        <div className="lamp-stage" onClick={!isOn ? toggleLamp : undefined} style={{ cursor: !isOn ? 'pointer' : 'default' }}>
          <div className="lamp-wrapper">
            <svg className="lamp-svg" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="metalArm" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3e434a" />
                  <stop offset="50%" stopColor="#7a828e" />
                  <stop offset="100%" stopColor="#24272c" />
                </linearGradient>
                <linearGradient id="brassJoint" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffe299" />
                  <stop offset="45%" stopColor="#c99738" />
                  <stop offset="85%" stopColor="#805915" />
                  <stop offset="100%" stopColor="#f5d38a" />
                </linearGradient>
                <linearGradient id="shadeExterior" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#343840" />
                  <stop offset="40%" stopColor="#21252a" />
                  <stop offset="100%" stopColor="#121417" />
                </linearGradient>
                <linearGradient id="shadeHighlight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="42%" stopColor="#ffffff" stopOpacity="0.16" />
                  <stop offset="72%" stopColor="#ffffff" stopOpacity="0.025" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="shadeRim" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffd584" />
                  <stop offset="50%" stopColor="#e2ab46" />
                  <stop offset="100%" stopColor="#996a1a" />
                </linearGradient>
                <radialGradient id="reflectorOff" cx="50%" cy="40%" r="70%">
                  <stop offset="0%" stopColor="#2c3036" />
                  <stop offset="55%" stopColor="#1a1d22" />
                  <stop offset="100%" stopColor="#0e1012" />
                </radialGradient>
                <radialGradient id="reflectorOn" cx="50%" cy="40%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="var(--lamp-glow, #ffe194)" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="var(--lamp-accent, #ffab3d)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#2a2015" stopOpacity="0.85" />
                </radialGradient>
                <linearGradient id="volumetricBeam" x1="0%" y1="0%" x2="90%" y2="70%">
                  <stop offset="0%" stopColor="var(--beam-start, rgba(255, 220, 130, 0.45))" />
                  <stop offset="25%" stopColor="var(--beam-mid, rgba(255, 195, 90, 0.22))" />
                  <stop offset="65%" stopColor="var(--beam-far, rgba(255, 175, 60, 0.08))" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </linearGradient>
                <filter id="bulbGlowFilter" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="beamSoftFilter" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>

              <ellipse className="desk-shadow" cx="190" cy="460" rx="90" ry="16" fill="rgba(0, 0, 0, 0.55)" />

              <g className="light-beam-group">
                <polygon
                  className="svg-light-beam"
                  points="182,185 308,225 820,480 340,510"
                  fill="url(#volumetricBeam)"
                  filter="url(#beamSoftFilter)"
                />
              </g>

              <g className="lamp-base-group">
                <ellipse cx="190" cy="445" rx="72" ry="14" fill="#15171a" />
                <ellipse cx="190" cy="443" rx="70" ry="12" fill="url(#metalArm)" />
                <ellipse cx="190" cy="441" rx="66" ry="10" fill="#1c1f24" />
                <ellipse cx="190" cy="439" rx="60" ry="7" fill="none" stroke="#8e949f" strokeOpacity=".22" strokeWidth=".8" />
                <circle cx="190" cy="439" r="15" fill="url(#brassJoint)" />
                <circle cx="190" cy="439" r="7" fill="#15171a" />
                <circle cx="190" cy="439" r="3.2" fill="#747b86" />
              </g>

              <g className="lamp-arm-lower">
                <line x1="186" y1="439" x2="156" y2="295" stroke="url(#metalArm)" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="194" y1="439" x2="164" y2="295" stroke="url(#metalArm)" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 188 420 Q 175 360 163 305" stroke="#606670" strokeWidth="2" strokeDasharray="3,3" fill="none" opacity="0.6" />
              </g>

              <g className="lamp-elbow-joint">
                <circle cx="160" cy="295" r="13" fill="url(#brassJoint)" />
                <circle cx="160" cy="295" r="6" fill="#1c1f24" />
                <circle cx="160" cy="295" r="3.3" fill="#858b94" />
                <line x1="155" y1="295" x2="165" y2="295" stroke="url(#brassJoint)" strokeWidth="2" />
              </g>

              <g className="lamp-arm-upper">
                <line x1="160" y1="295" x2="215" y2="175" stroke="url(#metalArm)" strokeWidth="5" strokeLinecap="round" />
                <path d="M 190 439 Q 168 360 160 295 Q 190 230 215 175" stroke="#101114" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>

              <g className="lamp-neck">
                <circle cx="215" cy="175" r="11" fill="url(#brassJoint)" />
                <rect x="209" y="162" width="16" height="15" rx="3" fill="url(#metalArm)" transform="rotate(25, 217, 169)" />
              </g>

              <g className="lamp-shade-assembly" id="shadeAssembly" ref={shadeAssemblyRef}>
                <path
                  className="lamp-shade-body"
                  d="M 182.3 184.6 C 188 135, 220 112, 248 115 C 275 118, 298 155, 307.7 225.4 A 66 22 18 0 1 182.3 184.6 Z"
                  fill="url(#shadeExterior)"
                  stroke="#16181b"
                  strokeWidth="1.8"
                />
                <path
                  className="shade-enamel-highlight"
                  d="M 187 181 C 193 139, 221 119, 247 120 C 267 122, 286 144, 297 178 C 271 163, 224 153, 187 181 Z"
                  fill="url(#shadeHighlight)"
                />
                <ellipse className="shade-reflector-off" cx="245" cy="205" rx="66" ry="22" transform="rotate(18, 245, 205)" fill="url(#reflectorOff)" />
                <ellipse className="shade-reflector-on" cx="245" cy="205" rx="66" ry="22" transform="rotate(18, 245, 205)" fill="url(#reflectorOn)" />
                <ellipse className="reflector-detail" cx="245" cy="205" rx="49" ry="14" transform="rotate(18, 245, 205)" fill="none" stroke="#fff3ce" strokeOpacity=".16" strokeWidth=".8" />
                <path className="shade-rim-trim" d="M 182.3 184.6 A 66 22 18 0 0 307.7 225.4" stroke="url(#shadeRim)" strokeWidth="4" fill="none" strokeLinecap="round" />

                <g className="bulb-unit" id="bulbUnit">
                  <ellipse className="bulb-glass" cx="245" cy="195" rx="14" ry="17" transform="rotate(18, 245, 195)" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
                  <path className="bulb-filament" d="M 241 189 Q 245 183 249 189" stroke={isOn ? 'var(--lamp-accent)' : '#555'} strokeWidth="1.8" fill="none" />
                  <circle className="bulb-glow-core" cx="245" cy="188" r="11" fill="var(--lamp-glow, #ffe194)" filter="url(#bulbGlowFilter)" opacity={isOn ? 0.9 : 0} />
                </g>

                <g className="cord-socket-grommet">
                  <rect x="242" y="206" width="6" height="6" rx="1.5" fill="url(#brassJoint)" stroke="#68420e" strokeWidth="0.8" />
                  <circle cx="245" cy="212" r="3" fill="#ffe299" stroke="#7a5513" strokeWidth="0.8" />
                  <circle cx="245" cy="212" r="1.3" fill="#181105" />
                </g>
              </g>

              {/* Dây kéo bật/tắt đèn */}
              <g className="pull-cord-system">
                <path ref={elasticCordRef} className="elastic-cord-path" id="elasticCord" d="M 245 212 L 245 300" stroke="#e8bb54" strokeWidth="2.6" strokeLinecap="round" />

                <g ref={cordBeadRef} className="cord-bead-group" id="cordBead" cursor="grab" onClick={toggleLamp}>
                  <circle className="bead-aura" cx="0" cy="0" r="16" fill="var(--lamp-accent)" opacity={isOn ? 0.2 : 0} />
                  <path className="bead-shape" d="M -4 -8 L 4 -8 L 7 6 C 7 10, -7 10, -7 6 Z" fill="url(#brassJoint)" stroke="#7a5513" strokeWidth="0.8" />
                  <ellipse cx="2" cy="0" rx="2" ry="4" fill="#fff" opacity="0.5" />
                  <circle className="cord-hit-area" id="cordHit" cx="0" cy="0" r="32" fill="transparent" />
                </g>
              </g>
            </svg>

            <div className="cord-tooltip" id="cordTooltip" onClick={toggleLamp} style={{ cursor: 'pointer' }}>
              <span>{isOn ? 'Bấm hoặc kéo dây để tắt' : 'Kéo dây hoặc bấm để bật đèn'}</span>
              <div className="tooltip-arrow"></div>
            </div>
          </div>
        </div>

        {/* Register Card Stage */}
        <div className="form-stage" ref={formStageRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div className="login-card" id="loginCard" ref={cardRef}>
            <div className="card-header">
              <h1 className="card-title">Tạo tài khoản</h1>
              <p className="card-subtitle">Đăng ký tài khoản mới để bắt đầu học tập và kết nối</p>
            </div>

            {/* Switch Tabs */}
            <div className="auth-tabs" data-active="register">
              <button
                type="button"
                className="auth-tab"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className="auth-tab active"
                onClick={() => setAlert(null)}
              >
                Đăng ký
              </button>
              <div className="tab-slider" id="tabSlider"></div>
            </div>

            {/* Thông báo Alert */}
            {alert && (
              <div className={`auth-alert auth-alert--${alert.type}`}>
                {alert.message}
              </div>
            )}

            {/* Form Đăng ký */}
            <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <label htmlFor="nameField">Họ và tên</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    type="text"
                    id="nameField"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="emailField">Email</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    type="email"
                    id="emailField"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="passField">Mật khẩu</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="passField"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <svg className="eye-icon eye-hide" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg className="eye-icon eye-show" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassField">Xác nhận mật khẩu</label>
                <div className="input-wrapper">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassField"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirmPassword ? (
                      <svg className="eye-icon eye-hide" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg className="eye-icon eye-show" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="options-row">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span className="checkbox-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span className="checkbox-label" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                    Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật
                  </span>
                </label>
              </div>

              <button type="submit" className="submit-btn" id="submitBtn" disabled={loading}>
                <span className="btn-glow-layer"></span>
                <span className="btn-content">
                  <span className="btn-text">
                    {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                  </span>
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </button>

              <div className="auth-divider">
                <span className="divider-line"></span>
                <span className="divider-text">hoặc đăng ký bằng</span>
                <span className="divider-line"></span>
              </div>

              <div className="social-row">
                <button type="button" className="social-btn" title="Đăng ký với Google">
                  <svg viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.5 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.5-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z" />
                  </svg>
                </button>
                <button type="button" className="social-btn" title="Đăng ký với GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </button>
                <button type="button" className="social-btn" title="Đăng ký với Apple">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.63-.78 1.06-1.86.94-2.94-1 .04-2.13.67-2.77 1.45-.58.68-1.08 1.79-.94 2.84 1.12.09 2.14-.57 2.77-1.35z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Modal thành công */}
            {successOverlay && (
              <div className="success-overlay">
                <div className="success-box">
                  <div className="success-ring">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3>Đăng ký thành công!</h3>
                  <p>Tài khoản của bạn đã được khởi tạo thành công. Bạn có thể đăng nhập ngay bây giờ.</p>
                  <button className="reset-demo-btn" onClick={() => navigate('/login')}>
                    Đăng Nhập Ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
