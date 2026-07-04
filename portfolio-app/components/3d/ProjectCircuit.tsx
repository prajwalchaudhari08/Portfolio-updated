'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import * as THREE from 'three';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAudioStore } from '@/store/useAudioStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectData extends ProjectEntry {
  color: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_COLORS = [0xb06ab3, 0x00bfff, 0x4568dc, 0xff007f, 0x00ffaa];

const CHECKPOINT_VOICE_LINES = [
  'Checkpoint reached. Project unlocked.',
  'Entering project zone. Data stream active.',
  'Welcome to the project showcase.',
  'Project module detected. Displaying details.',
  'Checkpoint secured. Accessing project data.',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToCSS(hex: number): string {
  return '#' + hex.toString(16).padStart(6, '0');
}

function hexToRGB(hex: number): [number, number, number] {
  return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff];
}

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
}

// ─── Web Speech API voice ─────────────────────────────────────────────────────

let voiceActive = false;

function speakCheckpoint(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (voiceActive) return; // prevent overlapping
  voiceActive = true;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 0.75;
  utterance.volume = 0.85;

  // Prefer a deep/robotic voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.name.toLowerCase().includes('google uk english male') ||
      v.name.toLowerCase().includes('microsoft david') ||
      v.name.toLowerCase().includes('alex') ||
      v.name.toLowerCase().includes('daniel')
  );
  if (preferred) utterance.voice = preferred;

  utterance.onend = () => {
    voiceActive = false;
    onEnd?.();
  };
  utterance.onerror = () => {
    voiceActive = false;
  };
  window.speechSynthesis.speak(utterance);
}

// ─── Web Audio engine sound ───────────────────────────────────────────────────

class EngineSound {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private started = false;

  start() {
    if (this.started) return;
    try {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gain.connect(this.ctx.destination);

      this.osc = this.ctx.createOscillator();
      this.osc.type = 'sawtooth';
      this.osc.frequency.setValueAtTime(55, this.ctx.currentTime);
      this.osc.connect(this.gain);
      this.osc.start();

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'square';
      this.osc2.frequency.setValueAtTime(110, this.ctx.currentTime);
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.osc2.connect(gain2);
      gain2.connect(this.gain);
      this.osc2.start();

      this.started = true;
    } catch (_) {
      // AudioContext may be blocked; silently ignore
    }
  }

  update(velocity: number, maxSpeed: number) {
    if (!this.ctx || !this.osc || !this.gain) return;
    const ratio = Math.abs(velocity) / maxSpeed;
    const freq = 50 + ratio * 200;
    const vol = ratio < 0.01 ? 0 : 0.04 + ratio * 0.1;
    const now = this.ctx.currentTime;
    this.osc.frequency.linearRampToValueAtTime(freq, now + 0.05);
    if (this.osc2) this.osc2.frequency.linearRampToValueAtTime(freq * 2, now + 0.05);
    this.gain.gain.linearRampToValueAtTime(vol, now + 0.1);
  }

  stop() {
    try {
      this.gain?.gain.linearRampToValueAtTime(0, (this.ctx?.currentTime ?? 0) + 0.3);
      setTimeout(() => {
        this.osc?.stop();
        this.osc2?.stop();
        this.ctx?.close();
      }, 400);
    } catch (_) {}
    this.started = false;
  }
}

// ─── Checkpoint flash helper (Three.js point light) ──────────────────────────

function createCheckpointFlash(
  scene: THREE.Scene,
  position: THREE.Vector3,
  color: number
): () => void {
  const light = new THREE.PointLight(color, 0, 40);
  light.position.copy(position);
  light.position.y += 5;
  scene.add(light);

  let intensity = 8;
  const decay = () => {
    intensity *= 0.88;
    light.intensity = intensity;
    if (intensity > 0.1) requestAnimationFrame(decay);
    else scene.remove(light);
  };
  decay();
  return () => scene.remove(light);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectCircuit({ onReturn }: { onReturn?: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const engineRef = useRef(new EngineSound());

  const { isMuted, subtitlesVisible } = useAudioStore();
  const isMutedRef = useRef(isMuted);
  const subtitlesVisibleRef = useRef(subtitlesVisible);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setVoiceLabel('');
    }
  }, [isMuted]);

  useEffect(() => {
    subtitlesVisibleRef.current = subtitlesVisible;
  }, [subtitlesVisible]);

  const [gameStarted, setGameStarted] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [speed, setSpeed] = useState(0);
  const [minimapProgress, setMinimapProgress] = useState(0);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [voiceLabel, setVoiceLabel] = useState('');
  const [checkpointFlash, setCheckpointFlash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  const stateRef = useRef({
    carProgress: 0,
    carVelocity: 0,
    // W/S for forward/brake, A/D for steer (track offset)
    keys: { w: false, s: false, a: false, d: false },
    gameStarted: false,
    currentActiveCheckpoint: -1,
    animId: 0,
    lastCheckpointIndex: -1,
  });

  // ── Detect mobile ──────────────────────────────────────────────────────────
  useEffect(() => {
    setIsMobile(isMobileDevice());
    const onResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Prevent page scroll / pinch-zoom while game is running ────────────────
  useEffect(() => {
    if (!gameStarted) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    document.addEventListener('touchmove', prevent, { passive: false });
    document.addEventListener('touchstart', prevent, { passive: false });
    return () => {
      document.removeEventListener('touchmove', prevent);
      document.removeEventListener('touchstart', prevent);
    };
  }, [gameStarted]);

  // ── Load projects ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          const list: ProjectEntry[] = data.data ?? [];
          setProjects(
            list.map((p, i) => ({ ...p, color: PROJECT_COLORS[i % PROJECT_COLORS.length] }))
          );
        }
      } catch (e) {
        console.error('Failed to fetch projects:', e);
      }
    };
    load();
  }, []);

  // ── Bootstrap Three.js ─────────────────────────────────────────────────────
  useEffect(() => {
    if (projects.length === 0) return;
    const mount = mountRef.current;
    if (!mount) return;

    const mobile = isMobileDevice();
    const lowPerf = mobile; // reduce geometry on mobile

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, mobile ? 0.008 : 0.012);

    // Camera — tighter FOV on portrait mobile
    const fov = mobile && window.innerHeight > window.innerWidth ? 75 : 60;
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.shadowMap.enabled = false; // off for perf
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0x7928ca, 1.2);
    dirLight.position.set(100, 200, 50);
    scene.add(dirLight);
    const cyanPoint = new THREE.PointLight(0x00bfff, 0.8, 300);
    cyanPoint.position.set(0, 30, 0);
    scene.add(cyanPoint);

    // ── Environment ─────────────────────────────────────────────────────────
    const grid = new THREE.GridHelper(1000, mobile ? 60 : 100, 0x7928ca, 0x111122);
    grid.position.y = -10;
    scene.add(grid);

    // Stars — fewer on mobile
    const starCount = lowPerf ? 500 : 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 800;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0x00bfff, size: 0.6, transparent: true, opacity: 0.55 })
      )
    );

    // ── Track Curve ──────────────────────────────────────────────────────────
    const trackPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -100),
      new THREE.Vector3(-100, 0, -200),
      new THREE.Vector3(-200, 0, -150),
      new THREE.Vector3(-250, 10, -50),
      new THREE.Vector3(-150, 0, 100),
      new THREE.Vector3(50, 0, 200),
      new THREE.Vector3(150, -10, 100),
      new THREE.Vector3(100, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ];
    const trackCurve = new THREE.CatmullRomCurve3(trackPoints);
    trackCurve.closed = true;

    const trackWidth = 12;
    const trackShape = new THREE.Shape();
    trackShape.moveTo(-trackWidth / 2, -0.35);
    trackShape.lineTo(trackWidth / 2, -0.35);
    trackShape.lineTo(trackWidth / 2, 0.35);
    trackShape.lineTo(-trackWidth / 2, 0.35);
    trackShape.lineTo(-trackWidth / 2, -0.35);

    const trackGeo = new THREE.ExtrudeGeometry(trackShape, {
      steps: lowPerf ? 200 : 300,
      extrudePath: trackCurve,
    });
    scene.add(
      new THREE.Mesh(
        trackGeo,
        new THREE.MeshStandardMaterial({ color: 0x0d0d1a, roughness: 0.9, metalness: 0.1 })
      )
    );
    // Neon track edges
    scene.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(trackGeo, 20),
        new THREE.LineBasicMaterial({ color: 0x00bfff })
      )
    );

    // ── F1 Car ───────────────────────────────────────────────────────────────
    const carGroup = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.9, roughness: 0.2 });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0x330011,
      emissiveIntensity: 0.6,
    });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 4), bodyMat);
    chassis.position.y = 0.5;
    carGroup.add(chassis);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.75, 2, 4), bodyMat);
    nose.rotation.set(Math.PI / 2, Math.PI / 4, 0);
    nose.position.set(0, 0.5, 3);
    carGroup.add(nose);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0 })
    );
    dome.position.set(0, 0.75, -0.5);
    dome.scale.z = 1.5;
    carGroup.add(dome);

    const fWing = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 0.8), accentMat);
    fWing.position.set(0, 0.2, 3.8);
    carGroup.add(fWing);

    const rWing = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 1), accentMat);
    rWing.position.set(0, 1.2, -1.8);
    carGroup.add(rWing);

    (['pillarL', 'pillarR'] as const).forEach((_, i) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.5), bodyMat);
      p.position.set(i === 0 ? -0.8 : 0.8, 0.8, -1.8);
      carGroup.add(p);
    });

    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelPositions: [number, number, number][] = [
      [-1.2, 0.5, 2.5],
      [1.2, 0.5, 2.5],
      [-1.3, 0.6, -1.5],
      [1.3, 0.6, -1.5],
    ];
    wheelPositions.forEach((pos, idx) => {
      const wheel = new THREE.Mesh(wheelGeo, tireMat);
      wheel.position.set(...pos);
      if (idx > 1) wheel.scale.setScalar(1.2);
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.05, 8, 16),
        new THREE.MeshBasicMaterial({ color: 0x00bfff })
      );
      rim.rotation.y = Math.PI / 2;
      rim.position.x = idx % 2 === 0 ? -0.32 : 0.32;
      wheel.add(rim);
      carGroup.add(wheel);
    });

    // Engine exhaust glow
    const glowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.6),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    );
    glowMesh.position.set(0, 0.6, -2.2);
    glowMesh.rotation.y = Math.PI;
    carGroup.add(glowMesh);

    // Camera anchor
    const camAnchor = new THREE.Object3D();
    // Mobile: higher up for better portrait view
    camAnchor.position.set(0, mobile ? 7 : 5, mobile ? -16 : -14);
    carGroup.add(camAnchor);

    scene.add(carGroup);

    // ── Checkpoints ──────────────────────────────────────────────────────────
    const spacing = 1.0 / projects.length;
    type CheckpointEntry = {
      progress: number;
      data: ProjectData;
      ring: THREE.Mesh;
      ringMat: THREE.MeshStandardMaterial;
      position: THREE.Vector3;
    };
    const checkpoints: CheckpointEntry[] = [];

    projects.forEach((project, index) => {
      const progress = index * spacing + 0.05;
      const point = trackCurve.getPointAt(progress);
      const tangent = trackCurve.getTangentAt(progress);

      const archGroup = new THREE.Group();
      archGroup.position.copy(point);
      archGroup.lookAt(point.clone().add(tangent));

      // Outer ring
      const ringGeo = new THREE.TorusGeometry(8, 0.4, 16, 60);
      ringGeo.rotateX(Math.PI / 2);
      ringGeo.rotateY(Math.PI / 2);
      const ringMat = new THREE.MeshStandardMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      archGroup.add(ring);

      // Inner accent ring
      const innerRingGeo = new THREE.TorusGeometry(6, 0.12, 8, 40);
      innerRingGeo.rotateX(Math.PI / 2);
      innerRingGeo.rotateY(Math.PI / 2);
      archGroup.add(
        new THREE.Mesh(
          innerRingGeo,
          new THREE.MeshBasicMaterial({ color: project.color, transparent: true, opacity: 0.45 })
        )
      );

      // Ground stripe
      const markerMat = new THREE.MeshBasicMaterial({
        color: project.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const marker = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), markerMat);
      marker.rotation.x = -Math.PI / 2;
      marker.position.y = 0.5;
      archGroup.add(marker);

      // Top beacon sphere
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 8, 8),
        new THREE.MeshBasicMaterial({ color: project.color })
      );
      beacon.position.y = 9.8;
      archGroup.add(beacon);

      scene.add(archGroup);
      checkpoints.push({ progress, data: project, ring, ringMat, position: point.clone() });
    });

    // ── Car position helper ──────────────────────────────────────────────────
    const updateCarPosition = (progress: number) => {
      const pos = trackCurve.getPointAt(progress);
      const tan = trackCurve.getTangentAt(progress);
      carGroup.position.copy(pos);
      carGroup.lookAt(pos.clone().add(tan));
    };
    updateCarPosition(0);
    camera.position.set(0, 20, 30);

    // ── Physics ──────────────────────────────────────────────────────────────
    const MAX_SPEED = 0.0015;
    const ACCEL = 0.00005;
    const BRAKE = 0.0001;
    const FRICTION = 0.98;

    // Speed boost zone vars
    let boostTimer = 0;

    // ── Animation loop ───────────────────────────────────────────────────────
    const animate = () => {
      const s = stateRef.current;
      if (!s.gameStarted) {
        renderer.render(scene, camera);
        s.animId = requestAnimationFrame(animate);
        return;
      }

      // Physics
      let accel = 0;
      if (s.keys.w) accel = ACCEL;
      else if (s.keys.s) accel = -BRAKE;

      // Boost from checkpoint speed-zone
      if (boostTimer > 0) {
        accel += ACCEL * 0.5;
        boostTimer--;
      }

      s.carVelocity += accel;
      s.carVelocity *= FRICTION;
      s.carVelocity = Math.max(Math.min(s.carVelocity, MAX_SPEED), -MAX_SPEED / 2);

      s.carProgress += s.carVelocity;
      if (s.carProgress > 1) s.carProgress -= 1;
      if (s.carProgress < 0) s.carProgress += 1;

      updateCarPosition(s.carProgress);

      // Engine glow pulsing with speed
      const speedRatio = Math.abs(s.carVelocity) / MAX_SPEED;
      (glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.4 + speedRatio * 0.6;

      // Camera
      const targetPos = new THREE.Vector3();
      camAnchor.getWorldPosition(targetPos);
      camera.position.lerp(targetPos, 0.08);
      const lookAhead = trackCurve.getPointAt((s.carProgress + 0.025) % 1);
      const curLook = new THREE.Vector3(0, 0, -1)
        .applyQuaternion(camera.quaternion)
        .add(camera.position);
      curLook.lerp(lookAhead, 0.1);
      camera.lookAt(curLook);

      // Engine sound update
      engineRef.current.update(s.carVelocity, MAX_SPEED);

      // Ring pulse animation
      const t = Date.now();
      checkpoints.forEach((cp, idx) => {
        const isActive = s.currentActiveCheckpoint === idx;
        // faster, brighter pulse when active
        const freq = isActive ? 0.008 : 0.004;
        const amp = isActive ? 0.5 : 0.3;
        const base = isActive ? 1.2 : 0.6;
        cp.ringMat.emissiveIntensity = Math.max(0, base + Math.sin(t * freq + idx * 1.2) * amp);
        const scaleBase = isActive ? 1.06 : 1;
        cp.ring.scale.setScalar(scaleBase + Math.sin(t * freq + idx) * 0.04);
      });

      // Checkpoint detection
      let nearest: { index: number; data: ProjectData; position: THREE.Vector3 } | null = null;
      checkpoints.forEach((cp, index) => {
        let dist = Math.abs(s.carProgress - cp.progress);
        if (dist > 0.5) dist = 1.0 - dist;
        if (dist < 0.03) nearest = { index, data: cp.data, position: cp.position };
      });

      const slowEnough = Math.abs(s.carVelocity) < MAX_SPEED * 0.5;
      if (nearest && slowEnough) {
        const n = nearest as { index: number; data: ProjectData; position: THREE.Vector3 };
        if (s.currentActiveCheckpoint !== n.index) {
          s.currentActiveCheckpoint = n.index;

          // Voice narration
          const line = CHECKPOINT_VOICE_LINES[n.index % CHECKPOINT_VOICE_LINES.length];
          setVoiceLabel(line);
          if (!isMutedRef.current) {
            speakCheckpoint(line, () => setVoiceLabel(''));
          } else {
            const lineToClear = line;
            setTimeout(() => {
              setVoiceLabel((prev) => (prev === lineToClear ? '' : prev));
            }, 3000);
          }

          // Haptic feedback (mobile)
          if (navigator.vibrate) navigator.vibrate([60, 30, 60]);

          // Light flash
          createCheckpointFlash(scene, n.position, n.data.color);

          // Speed boost as reward
          boostTimer = 40;

          setCheckpointFlash(true);
          setTimeout(() => setCheckpointFlash(false), 800);
          setCardVisible(false);
          setTimeout(() => {
            setActiveProject(n.data);
            setCardVisible(true);
          }, 80);
        }
      } else {
        if (s.currentActiveCheckpoint !== -1) {
          s.currentActiveCheckpoint = -1;
          setCardVisible(false);
          setTimeout(() => setActiveProject(null), 400);
        }
      }

      const displaySpeed = Math.abs(Math.round((s.carVelocity / MAX_SPEED) * 320));
      setSpeed(displaySpeed);
      setMinimapProgress(s.carProgress);

      renderer.render(scene, camera);
      s.animId = requestAnimationFrame(animate);
    };

    stateRef.current.animId = requestAnimationFrame(animate);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') stateRef.current.keys.w = true;
      if (e.key === 's' || e.key === 'ArrowDown') stateRef.current.keys.s = true;
      if (e.key === 'a' || e.key === 'ArrowLeft') stateRef.current.keys.a = true;
      if (e.key === 'd' || e.key === 'ArrowRight') stateRef.current.keys.d = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') stateRef.current.keys.w = false;
      if (e.key === 's' || e.key === 'ArrowDown') stateRef.current.keys.s = false;
      if (e.key === 'a' || e.key === 'ArrowLeft') stateRef.current.keys.a = false;
      if (e.key === 'd' || e.key === 'ArrowRight') stateRef.current.keys.d = false;
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      cancelAnimationFrame(stateRef.current.animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [projects]);

  // ── Start game ─────────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    setGameStarted(true);
    stateRef.current.gameStarted = true;
    engineRef.current.start();
    // Pre-load voices on user gesture (required on some browsers)
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
  }, []);

  // ── Touch/mouse control helpers ────────────────────────────────────────────
  const pressKey = useCallback((key: 'w' | 's' | 'a' | 'd') => {
    stateRef.current.keys[key] = true;
  }, []);
  const releaseKey = useCallback((key: 'w' | 's' | 'a' | 'd') => {
    stateRef.current.keys[key] = false;
  }, []);

  // ── Minimap geometry ──────────────────────────────────────────────────────
  const MM_R = 58;
  const carAngle = minimapProgress * Math.PI * 2 - Math.PI / 2;
  const mmCarX = Math.cos(carAngle) * MM_R + 75;
  const mmCarY = Math.sin(carAngle) * MM_R + 75;

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#050510] select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-[1]" />

      {/* Checkpoint flash vignette */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,191,255,0.18) 0%, transparent 70%)',
          opacity: checkpointFlash ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />

      {/* ── Start Overlay ─────────────────────────────────────────────────── */}
      {!gameStarted && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4"
          style={{ background: 'rgba(5,5,16,0.93)', backdropFilter: 'blur(6px)' }}
        >
          {/* Animated icon */}
          <div className="relative mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border border-purple-500/25 animate-ping"
                style={{ animationDelay: `${i * 0.4}s`, animationDuration: '2.8s' }}
              />
            ))}
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.5)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 md:w-12 md:h-12 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-3 tracking-tighter uppercase italic text-center"
            style={{
              background: 'linear-gradient(90deg, #ff007f, #7928ca, #00bfff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 28px rgba(121,40,202,0.55))',
            }}
          >
            PROJECT CIRCUIT
          </h1>

          <p className="text-gray-300 mb-1 text-sm md:text-lg max-w-sm text-center leading-relaxed">
            Drive through the projects. Stop at checkpoint rings to unlock details.
          </p>
          <p className="text-gray-500 mb-8 text-xs md:text-sm text-center font-mono">
            AI voice narration activates at each checkpoint.
          </p>

          {/* Controls preview */}
          {!isMobile ? (
            <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-400 font-mono">
              <span><kbd className="kbdkey">W</kbd> <kbd className="kbdkey">↑</kbd> Accelerate</span>
              <span><kbd className="kbdkey">S</kbd> <kbd className="kbdkey">↓</kbd> Brake</span>
              <span><kbd className="kbdkey">A</kbd> <kbd className="kbdkey">←</kbd> Steer Left</span>
              <span><kbd className="kbdkey">D</kbd> <kbd className="kbdkey">→</kbd> Steer Right</span>
            </div>
          ) : (
            <div className="mb-8 text-center text-xs text-gray-500 font-mono">
              🎮 On-screen racing controls will appear after start
            </div>
          )}

          <button
            onClick={handleStart}
            className="relative px-8 py-3 md:px-10 md:py-4 rounded-full text-white font-bold text-base md:text-lg uppercase tracking-[3px] cursor-pointer border-0 transition-all duration-200 active:scale-95 hover:scale-105"
            style={{
              background: 'linear-gradient(45deg, #7928ca, #ff007f)',
              boxShadow: '0 0 30px rgba(255,0,127,0.5), 0 0 60px rgba(121,40,202,0.3)',
            }}
          >
            ⚡ Start Engine
          </button>
        </div>
      )}

      {/* ── In-Game HUD ───────────────────────────────────────────────────── */}
      {gameStarted && (
        <div className="absolute inset-0 z-10 pointer-events-none">

          {/* Top-left: Back + Title + Speed */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-auto">
            <button
              onClick={onReturn || (() => router.push('/experience'))}
              className="flex items-center gap-1.5 mb-3 text-gray-400 hover:text-cyan-400 transition-colors text-xs md:text-sm font-mono bg-black/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur"
            >
              <ArrowLeft size={13} />
              Return
            </button>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic leading-tight">
              <span
                style={{
                  background: 'linear-gradient(90deg, #ff007f, #7928ca, #00bfff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PROJECTS
              </span>
            </h1>

            {/* Speedometer */}
            <div
              className="mt-1.5 font-mono text-xs md:text-sm text-cyan-400 tracking-widest"
              style={{ textShadow: '0 0 8px rgba(0,191,255,0.6)' }}
            >
              SPD: {speed.toString().padStart(3, '0')} km/h
            </div>
          </div>

          {/* Top-right: Desktop controls panel (hidden on mobile) */}
          {!isMobile && (
            <div
              className="absolute top-4 right-4 md:top-6 md:right-6 hidden md:block text-right text-sm text-gray-300 rounded-xl px-4 py-3"
              style={{
                background: 'rgba(10,10,20,0.65)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="text-[10px] font-mono text-gray-500 mb-2 tracking-widest">DRIVE CONTROLS</div>
              <div className="mb-1 text-xs"><kbd className="kbdkey-sm">W</kbd> <kbd className="kbdkey-sm">↑</kbd> Accelerate</div>
              <div className="mb-1 text-xs"><kbd className="kbdkey-sm">S</kbd> <kbd className="kbdkey-sm">↓</kbd> Brake</div>
              <div className="mb-1 text-xs"><kbd className="kbdkey-sm">A</kbd> <kbd className="kbdkey-sm">←</kbd> Left</div>
              <div className="text-xs"><kbd className="kbdkey-sm">D</kbd> <kbd className="kbdkey-sm">→</kbd> Right</div>
            </div>
          )}

          {/* ── AI Voice Label ───────────────────────────────────────────── */}
          {voiceLabel && subtitlesVisible && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                animation: 'fadeInUp 0.3s ease forwards',
              }}
            >
              <div
                className="text-center px-5 py-2 rounded-full text-xs md:text-sm font-mono tracking-widest text-cyan-300 uppercase"
                style={{
                  background: 'rgba(0,191,255,0.08)',
                  border: '1px solid rgba(0,191,255,0.3)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 0 20px rgba(0,191,255,0.2)',
                  textShadow: '0 0 10px rgba(0,191,255,0.8)',
                }}
              >
                🔊 {voiceLabel}
              </div>
            </div>
          )}

          {/* ── Minimap ──────────────────────────────────────────────────── */}
          <div
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8"
            style={{
              width: isMobile ? 110 : 150,
              height: isMobile ? 110 : 150,
              background: 'rgba(0,0,0,0.55)',
              border: '2px solid rgba(0,191,255,0.3)',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 20px rgba(0,191,255,0.1)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-mono text-gray-600 tracking-widest">MAP</span>
            </div>
            {/* Checkpoint dots */}
            {projects.map((p, i) => {
              const ang = (i / projects.length) * Math.PI * 2 + 0.05 * Math.PI * 2 - Math.PI / 2;
              const r = isMobile ? 42 : 58;
              const cx = isMobile ? 55 : 75;
              const x = Math.cos(ang) * r + cx;
              const y = Math.sin(ang) * r + cx;
              return (
                <div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    width: 7, height: 7,
                    left: x - 3.5, top: y - 3.5,
                    background: hexToCSS(p.color),
                    boxShadow: `0 0 6px ${hexToCSS(p.color)}`,
                  }}
                />
              );
            })}
            {/* Car dot */}
            <div
              className="absolute rounded-full"
              style={{
                width: 10, height: 10,
                left: mmCarX * (isMobile ? 0.733 : 1) - 5,
                top: mmCarY * (isMobile ? 0.733 : 1) - 5,
                background: '#ff007f',
                boxShadow: '0 0 14px #ff007f',
                transition: 'left 0.1s linear, top 0.1s linear',
              }}
            />
          </div>

          {/* ── Project Info Card ─────────────────────────────────────────── */}
          {activeProject && (
            <div
              className="absolute pointer-events-auto"
              style={{
                bottom: isMobile ? 140 : 24,
                left: '50%',
                width: isMobile ? '95%' : '90%',
                maxWidth: 560,
                transition: 'opacity 0.4s cubic-bezier(0.175,0.885,0.32,1.275), transform 0.45s cubic-bezier(0.175,0.885,0.32,1.275)',
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible
                  ? 'translateX(-50%) translateY(0) scale(1)'
                  : 'translateX(-50%) translateY(18px) scale(0.97)',
              }}
            >
              {(() => {
                const [r, g, b] = hexToRGB(activeProject.color);
                return (
                  <div
                    className="rounded-xl p-4 md:p-6"
                    style={{
                      background: 'rgba(8,8,20,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid rgba(${r},${g},${b},0.35)`,
                      borderTop: `4px solid ${hexToCSS(activeProject.color)}`,
                      boxShadow: `0 12px 50px rgba(${r},${g},${b},0.22), 0 0 0 1px rgba(${r},${g},${b},0.1)`,
                    }}
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        {activeProject.featured && (
                          <span className="block text-[10px] font-bold uppercase tracking-[2px] text-amber-400 mb-1">
                            ★ Featured
                          </span>
                        )}
                        <h2
                          className="text-xl md:text-2xl font-bold leading-tight"
                          style={{ color: hexToCSS(activeProject.color) }}
                        >
                          {activeProject.title}
                        </h2>
                      </div>
                      {/* Animated accent dot */}
                      <div
                        className="flex-shrink-0 w-3 h-3 rounded-full mt-1 animate-pulse"
                        style={{ background: hexToCSS(activeProject.color), boxShadow: `0 0 10px ${hexToCSS(activeProject.color)}` }}
                      />
                    </div>

                    <p className="text-gray-300 text-xs md:text-sm mb-3 leading-relaxed line-clamp-2 md:line-clamp-3">
                      {activeProject.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-0">
                      {activeProject.techStack.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase font-mono px-2 py-0.5 rounded"
                          style={{
                            color: hexToCSS(activeProject.color),
                            background: `rgba(${r},${g},${b},0.12)`,
                            border: `1px solid rgba(${r},${g},${b},0.3)`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {(activeProject.githubUrl || activeProject.liveUrl) && (
                      <div className="flex gap-3 mt-3 pt-3 border-t border-white/10">
                        {activeProject.githubUrl && (
                          <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-mono text-gray-400 hover:text-white transition-colors">
                            GitHub →
                          </a>
                        )}
                        {activeProject.liveUrl && (
                          <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-mono text-gray-400 hover:text-white transition-colors">
                            Live Demo →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── Slow-down hint ────────────────────────────────────────────── */}
          {speed > 90 && !activeProject && (
            <div
              className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
              style={{ opacity: Math.min((speed - 90) / 60, 0.65) }}
            >
              <p className="text-[10px] md:text-xs font-mono text-gray-500">
                Slow down near a checkpoint ring to reveal project details
              </p>
            </div>
          )}

          {/* ── Mobile Racing Controls ────────────────────────────────────── */}
          {isMobile && (
            <div className="absolute bottom-4 left-0 right-0 pointer-events-auto">
              {/* Steer row */}
              <div className="flex justify-between px-4 mb-3">
                {/* Steer Left */}
                <button
                  onTouchStart={() => pressKey('a')} onTouchEnd={() => releaseKey('a')}
                  onMouseDown={() => pressKey('a')} onMouseUp={() => releaseKey('a')} onMouseLeave={() => releaseKey('a')}
                  className="touch-btn"
                  style={touchBtnStyle}
                >
                  ◀
                </button>
                {/* Steer Right */}
                <button
                  onTouchStart={() => pressKey('d')} onTouchEnd={() => releaseKey('d')}
                  onMouseDown={() => pressKey('d')} onMouseUp={() => releaseKey('d')} onMouseLeave={() => releaseKey('d')}
                  className="touch-btn"
                  style={touchBtnStyle}
                >
                  ▶
                </button>
              </div>

              {/* Accel / Brake row */}
              <div className="flex justify-center gap-6">
                <button
                  onTouchStart={() => pressKey('s')} onTouchEnd={() => releaseKey('s')}
                  onMouseDown={() => pressKey('s')} onMouseUp={() => releaseKey('s')} onMouseLeave={() => releaseKey('s')}
                  style={{ ...touchBtnStyle, background: 'rgba(120,0,40,0.7)', borderColor: 'rgba(255,0,127,0.5)' }}
                >
                  ⬛ BRAKE
                </button>
                <button
                  onTouchStart={() => pressKey('w')} onTouchEnd={() => releaseKey('w')}
                  onMouseDown={() => pressKey('w')} onMouseUp={() => releaseKey('w')} onMouseLeave={() => releaseKey('w')}
                  style={{ ...touchBtnStyle, background: 'rgba(0,60,80,0.7)', borderColor: 'rgba(0,191,255,0.5)', fontSize: 13 }}
                >
                  ⚡ ACCEL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global inline styles for kbd + animation */}
      <style>{`
        .kbdkey {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          background: #1f1f2e;
          border: 1px solid #3f3f5f;
          border-radius: 4px;
          color: #00bfff;
          font-family: monospace;
          font-weight: bold;
          font-size: 0.75rem;
          margin-right: 3px;
          box-shadow: 0 2px 0 #111;
        }
        .kbdkey-sm {
          display: inline-block;
          padding: 0.1rem 0.35rem;
          background: #1f1f2e;
          border: 1px solid #3f3f5f;
          border-radius: 3px;
          color: #00bfff;
          font-family: monospace;
          font-weight: bold;
          font-size: 0.65rem;
          margin-right: 2px;
          box-shadow: 0 1px 0 #111;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 10px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Inline touch button style ────────────────────────────────────────────────

const touchBtnStyle: React.CSSProperties = {
  width: 72,
  height: 52,
  borderRadius: 14,
  background: 'rgba(20,20,40,0.75)',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'monospace',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  transition: 'background 0.1s',
};
