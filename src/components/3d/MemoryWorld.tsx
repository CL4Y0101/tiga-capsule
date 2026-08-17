"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Html,
  Sparkles,
} from "@react-three/drei";
import {
  Suspense,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

import { useAppStore } from "../../store/useAppStore";
import { useAudio } from "../../hooks/useAudio";

import {
  CHARACTERS,
  Character,
} from "../../data/characters";

import CharacterChat from "../chatbot/CharacterChat";

import id from "../../locales/id.json";
import en from "../../locales/en.json";
import ko from "../../locales/ko.json";

const translations = { id, en, ko };

type Vec3 = [number, number, number];

type Expression =
  | "happy"
  | "playful"
  | "sleepy"
  | "calm"
  | "deadpan"
  | "warm"
  | "tired";

interface LandmarkProps {
  position: Vec3;
  color: string;
  name: string;
  type:
    | "book"
    | "camera"
    | "envelope"
    | "crystal";
  icon?: string;
  onClick: () => void;
}

interface PixelCharacterProps extends Character {
  onClick?: () => void;
}

/* =========================================================
   UTILITY
========================================================= */

function getAnimationOffset(id: string) {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash =
      (hash << 5) -
      hash +
      id.charCodeAt(i);

    hash |= 0;
  }

  return (
    (Math.abs(hash) % 1000) / 1000
  ) *
    Math.PI *
    2;
}

/**
 * Maps each character to their visual expression.
 * This is intentionally separate from MBTI.
 * The personality description is what drives the visual identity.
 */
function getCharacterExpression(
  id: string
): Expression {
  switch (id) {
    case "adit":
      return "playful";

    case "rio":
      return "playful";

    case "bian":
      return "warm";

    case "jueun":
      return "happy";

    case "suah":
      return "tired";

    case "ika":
      return "sleepy";

    case "naufal":
      return "warm";

    case "yoon":
      return "calm";

    case "dongkyun":
      return "deadpan";

    default:
      return "calm";
  }
}

/* =========================================================
   PIXEL FACE
========================================================= */

function PixelFace({
  expression,
  blinking,
  hovered,
}: {
  expression: Expression;
  blinking: boolean;
  hovered: boolean;
}) {
  /*
   * Face sits slightly in front of the head.
   * The character model is facing local +Z.
   */

  const eyeColor = "#1F2937";
  const mouthColor = "#1F2937";

  /*
   * Eye dimensions.
   *
   * Normally:
   *  left eye  = small square
   *  right eye = small square
   *
   * During blink:
   *  height becomes very small.
   */

  let eyeHeight = 0.055;

  if (blinking) {
    eyeHeight = 0.012;
  }

  /*
   * Slightly different eye styles.
   */

  let eyeWidth = 0.06;

  if (
    expression === "sleepy" ||
    expression === "tired"
  ) {
    eyeWidth = 0.07;
  }

  /*
   * Eye Y position.
   */

  let eyeY = 0.66;

  if (expression === "sleepy") {
    eyeY = 0.655;
  }

  /*
   * Mouth configuration.
   */

  let mouthWidth = 0.10;
  let mouthHeight = 0.025;
  let mouthY = 0.545;
  let mouthX = 0;
  let mouthRotation = 0;

  /*
   * Expression-specific tweaks.
   */

  switch (expression) {
    case "happy":
      mouthWidth = 0.12;
      mouthHeight = 0.035;
      mouthY = 0.545;
      break;

    case "warm":
      mouthWidth = 0.09;
      mouthHeight = 0.028;
      break;

    case "playful":
      mouthWidth = 0.12;
      mouthHeight = 0.028;
      mouthRotation = -0.15;
      mouthX = 0.015;
      break;

    case "sleepy":
      mouthWidth = 0.085;
      mouthHeight = 0.018;
      mouthY = 0.54;
      break;

    case "tired":
      mouthWidth = 0.08;
      mouthHeight = 0.018;
      mouthY = 0.54;
      break;

    case "deadpan":
      mouthWidth = 0.10;
      mouthHeight = 0.018;
      break;

    case "calm":
    default:
      mouthWidth = 0.09;
      mouthHeight = 0.022;
      break;
  }

  /*
   * Hover expression:
   * slightly larger/brighter face.
   */

  if (hovered) {
    eyeWidth *= 1.06;
  }

  return (
    <group>
      {/* =================================================
          LEFT EYE
      ================================================= */}

      <mesh
        position={[
          -0.09,
          eyeY,
          0.218,
        ]}
      >
        <boxGeometry
          args={[
            eyeWidth,
            eyeHeight,
            0.02,
          ]}
        />

        <meshBasicMaterial
          color={eyeColor}
        />
      </mesh>

      {/* =================================================
          RIGHT EYE
      ================================================= */}

      <mesh
        position={[
          0.09,
          eyeY,
          0.218,
        ]}
      >
        <boxGeometry
          args={[
            eyeWidth,
            eyeHeight,
            0.02,
          ]}
        />

        <meshBasicMaterial
          color={eyeColor}
        />
      </mesh>

      {/* =================================================
          SMALL BLUSH FOR WARM/HAPPY
      ================================================= */}

      {(expression === "happy" ||
        expression === "warm" ||
        expression === "playful") && (
        <>
          <mesh
            position={[
              -0.155,
              0.575,
              0.217,
            ]}
          >
            <boxGeometry
              args={[
                0.055,
                0.025,
                0.018,
              ]}
            />

            <meshBasicMaterial
              color="#F7A8B8"
              transparent
              opacity={0.75}
            />
          </mesh>

          <mesh
            position={[
              0.155,
              0.575,
              0.217,
            ]}
          >
            <boxGeometry
              args={[
                0.055,
                0.025,
                0.018,
              ]}
            />

            <meshBasicMaterial
              color="#F7A8B8"
              transparent
              opacity={0.75}
            />
          </mesh>
        </>
      )}

      {/* =================================================
          MOUTH
      ================================================= */}

      <mesh
        position={[
          mouthX,
          mouthY,
          0.218,
        ]}
        rotation={[
          0,
          0,
          mouthRotation,
        ]}
      >
        <boxGeometry
          args={[
            mouthWidth,
            mouthHeight,
            0.02,
          ]}
        />

        <meshBasicMaterial
          color={mouthColor}
        />
      </mesh>

      {/* =================================================
          SLEEPY EYELIDS
      ================================================= */}

      {(expression === "sleepy" ||
        expression === "tired") &&
        !blinking && (
          <>
            <mesh
              position={[
                -0.09,
                0.68,
                0.221,
              ]}
              rotation={[
                0,
                0,
                -0.12,
              ]}
            >
              <boxGeometry
                args={[
                  0.08,
                  0.025,
                  0.02,
                ]}
              />

              <meshBasicMaterial
                color="#FFDDBB"
              />
            </mesh>

            <mesh
              position={[
                0.09,
                0.68,
                0.221,
              ]}
              rotation={[
                0,
                0,
                0.12,
              ]}
            >
              <boxGeometry
                args={[
                  0.08,
                  0.025,
                  0.02,
                ]}
              />

              <meshBasicMaterial
                color="#FFDDBB"
              />
            </mesh>
          </>
        )}
    </group>
  );
}

/* =========================================================
   PIXEL CHARACTER
========================================================= */

function PixelCharacter({
  id,
  name,
  position,
  bodyColor,
  hairColor,
  accessory,
  onClick,
}: PixelCharacterProps) {
  const group =
    useRef<THREE.Group>(null);

  const body =
    useRef<THREE.Group>(null);

  const leftArm =
    useRef<THREE.Mesh>(null);

  const rightArm =
    useRef<THREE.Mesh>(null);

  const [hovered, setHovered] =
    useState(false);

  const clickTimer =
    useRef(0);

  const blinkTimer =
    useRef(0);

  const blinkCooldown =
    useRef(2.5);

  const {
    playSfx,
  } = useAudio();

  const animationOffset =
    useMemo(
      () => getAnimationOffset(id),
      [id]
    );

  const expression =
    getCharacterExpression(id);

  /*
   * Start every character's blink cycle
   * at a different time.
   */
  const initialBlinkDelay =
    useMemo(() => {
      const hash =
        Math.abs(
          id
            .split("")
            .reduce(
              (acc, char) =>
                acc +
                char.charCodeAt(0),
              0
            )
        );

      return 1.5 +
        (hash % 350) / 100;
    }, [id]);

  useMemo(() => {
    blinkCooldown.current =
      initialBlinkDelay;
  }, [initialBlinkDelay]);

  useFrame(
    (state, delta) => {
      if (
        !group.current ||
        !body.current
      ) {
        return;
      }

      const time =
        state.clock.elapsedTime +
        animationOffset;

      /* =================================================
         IDLE FLOAT
      ================================================= */

      group.current.position.y =
        position[1] +
        Math.sin(
          time * 1.6
        ) *
          0.045;

      /* =================================================
         BODY SWAY
      ================================================= */

      body.current.rotation.z =
        Math.sin(
          time * 1.15
        ) * 0.025;

      body.current.rotation.y =
        Math.sin(
          time * 0.6
        ) * 0.02;

      /* =================================================
         ARM MOVEMENT
      ================================================= */

      if (leftArm.current) {
        leftArm.current.rotation.z =
          Math.sin(
            time * 1.5
          ) * 0.08;
      }

      if (rightArm.current) {
        rightArm.current.rotation.z =
          -Math.sin(
            time * 1.5
          ) * 0.08;
      }

      /* =================================================
         LOOK TOWARD CENTER
      ================================================= */

      const targetRotation =
        Math.atan2(
          -position[0],
          -position[2]
        );

      group.current.rotation.y =
        THREE.MathUtils.lerp(
          group.current.rotation.y,
          targetRotation,
          1 -
            Math.pow(
              0.001,
              delta
            )
        );

      /* =================================================
         HOVER SCALE
      ================================================= */

      const targetScale =
        hovered ? 1.15 : 1;

      const currentScale =
        group.current.scale.x;

      const nextScale =
        THREE.MathUtils.lerp(
          currentScale,
          targetScale,
          1 -
            Math.pow(
              0.001,
              delta
            )
        );

      group.current.scale.x =
        nextScale;

      group.current.scale.z =
        nextScale;

      /* =================================================
         CLICK BOUNCE
      ================================================= */

      if (
        clickTimer.current >
        0
      ) {
        clickTimer.current -=
          delta;

        const progress =
          1 -
          clickTimer.current /
            0.42;

        const bounce =
          Math.sin(
            progress *
              Math.PI
          ) * 0.24;

        group.current.scale.y =
          nextScale +
          bounce;
      } else {
        group.current.scale.y =
          nextScale;
      }

      /* =================================================
         BLINK SYSTEM
      ================================================= */

      if (
        blinkTimer.current >
        0
      ) {
        blinkTimer.current -=
          delta;

        if (
          blinkTimer.current <=
          0
        ) {
          blinkTimer.current = 0;

          /*
           * Next blink after 2.5-6 sec.
           */
          blinkCooldown.current =
            2.5 +
            (
              Math.abs(
                Math.sin(
                  time * 3.17
                )
              ) * 3.5
            );
        }
      } else {
        blinkCooldown.current -=
          delta;

        if (
          blinkCooldown.current <=
          0
        ) {
          blinkTimer.current =
            0.14;
        }
      }
    }
  );

  const handleClick = (
    event: any
  ) => {
    event.stopPropagation();

    clickTimer.current =
      0.42;

    /*
     * Clicking also triggers
     * an immediate blink.
     */
    blinkTimer.current =
      0.18;

    playSfx("click");

    onClick?.();
  };

  const handlePointerOver = (
    event: any
  ) => {
    event.stopPropagation();

    if (!hovered) {
      playSfx("hover");
    }

    setHovered(true);

    /*
     * Cute reaction when hovered.
     */
    blinkTimer.current =
      0.14;

    document.body.style.cursor =
      "pointer";
  };

  const handlePointerOut = (
    event: any
  ) => {
    event.stopPropagation();

    setHovered(false);

    document.body.style.cursor =
      "default";
  };

  return (
    <group
      ref={group}
      position={position}
      onClick={handleClick}
      onPointerOver={
        handlePointerOver
      }
      onPointerOut={
        handlePointerOut
      }
    >
      <group ref={body}>

        {/* =================================================
            HEAD
        ================================================= */}

        <mesh
          position={[
            0,
            0.62,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.42,
              0.42,
              0.42,
            ]}
          />

          <meshStandardMaterial
            color="#FFDDBB"
            roughness={0.85}
          />
        </mesh>

        {/* =================================================
            FACE
        ================================================= */}

        <PixelFace
          expression={
            hovered &&
            (expression ===
              "playful" ||
              expression ===
                "happy")
              ? "happy"
              : expression
          }
          blinking={
            blinkTimer.current >
            0
          }
          hovered={hovered}
        />

        {/* =================================================
            HAIR
        ================================================= */}

        <mesh
          position={[
            0,
            0.85,
            -0.02,
          ]}
        >
          <boxGeometry
            args={[
              0.46,
              0.13,
              0.46,
            ]}
          />

          <meshStandardMaterial
            color={hairColor}
            roughness={0.9}
          />
        </mesh>

        {/* =================================================
            BODY
        ================================================= */}

        <mesh
          position={[
            0,
            0.27,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.34,
              0.34,
              0.28,
            ]}
          />

          <meshStandardMaterial
            color={bodyColor}
            roughness={0.75}
          />
        </mesh>

        {/* =================================================
            LEFT ARM
        ================================================= */}

        <mesh
          ref={leftArm}
          position={[
            -0.23,
            0.28,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.1,
              0.28,
              0.1,
            ]}
          />

          <meshStandardMaterial
            color={bodyColor}
            roughness={0.75}
          />
        </mesh>

        {/* =================================================
            RIGHT ARM
        ================================================= */}

        <mesh
          ref={rightArm}
          position={[
            0.23,
            0.28,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.1,
              0.28,
              0.1,
            ]}
          />

          <meshStandardMaterial
            color={bodyColor}
            roughness={0.75}
          />
        </mesh>

        {/* =================================================
            LEGS
        ================================================= */}

        <mesh
          position={[
            -0.08,
            0.05,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.11,
              0.16,
              0.11,
            ]}
          />

          <meshStandardMaterial
            color="#333333"
            roughness={0.9}
          />
        </mesh>

        <mesh
          position={[
            0.08,
            0.05,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.11,
              0.16,
              0.11,
            ]}
          />

          <meshStandardMaterial
            color="#333333"
            roughness={0.9}
          />
        </mesh>

        {/* =================================================
            HAT
        ================================================= */}

        {accessory === "hat" && (
          <group>
            <mesh
              position={[
                0,
                0.98,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  0.38,
                  0.14,
                  0.38,
                ]}
              />

              <meshStandardMaterial
                color="#FF7043"
              />
            </mesh>

            <mesh
              position={[
                0,
                1.06,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  0.24,
                  0.12,
                  0.24,
                ]}
              />

              <meshStandardMaterial
                color="#FF7043"
              />
            </mesh>
          </group>
        )}

        {/* =================================================
            FLOWER
        ================================================= */}

        {accessory ===
          "flower" && (
          <group
            position={[
              0.18,
              0.86,
              0.18,
            ]}
          >
            <mesh>
              <boxGeometry
                args={[
                  0.1,
                  0.1,
                  0.1,
                ]}
              />

              <meshStandardMaterial
                color="#FF4081"
              />
            </mesh>

            <mesh
              position={[
                0.08,
                0.03,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  0.07,
                  0.07,
                  0.07,
                ]}
              />

              <meshStandardMaterial
                color="#FFD54F"
              />
            </mesh>
          </group>
        )}

        {/* =================================================
            BOOK
        ================================================= */}

        {accessory ===
          "book" && (
          <mesh
            position={[
              0.23,
              0.22,
              0.12,
            ]}
            rotation={[
              0,
              0.25,
              0,
            ]}
          >
            <boxGeometry
              args={[
                0.09,
                0.2,
                0.16,
              ]}
            />

            <meshStandardMaterial
              color="#42A5F5"
            />
          </mesh>
        )}

        {/* =================================================
            CAMERA
        ================================================= */}

        {accessory ===
          "camera" && (
          <group
            position={[
              0.24,
              0.28,
              0.13,
            ]}
          >
            <mesh>
              <boxGeometry
                args={[
                  0.16,
                  0.11,
                  0.09,
                ]}
              />

              <meshStandardMaterial
                color="#374151"
              />
            </mesh>

            <mesh
              position={[
                0,
                0,
                0.06,
              ]}
            >
              <cylinderGeometry
                args={[
                  0.035,
                  0.035,
                  0.03,
                  12,
                ]}
              />

              <meshStandardMaterial
                color="#CBD5E1"
              />
            </mesh>
          </group>
        )}
      </group>

      {/* =================================================
          HOVER EFFECT
      ================================================= */}

      {hovered && (
        <>
          <Sparkles
            count={18}
            scale={1.35}
            size={3}
            speed={0.5}
            opacity={0.85}
            color="#FFFFFF"
          />

          <pointLight
            intensity={0.65}
            distance={2.2}
            color={bodyColor}
          />
        </>
      )}

      {/* =================================================
          NAME
      ================================================= */}

      {hovered && (
        <Html
          position={[
            0,
            1.45,
            0,
          ]}
          center
          distanceFactor={8}
          zIndexRange={[
            100,
            0,
          ]}
        >
          <div
            className="
              bg-white/95
              backdrop-blur-md
              px-3
              py-1.5
              rounded-xl
              border-2
              border-capsule-navy
              shadow-pixel-sm
              text-capsule-navy
              font-bold
              text-[10px]
              sm:text-xs
              whitespace-nowrap
              pointer-events-none
              select-none
            "
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

/* =========================================================
   LANDMARK
========================================================= */

function LandmarkObject({
  position,
  color,
  name,
  type,
  icon,
  onClick,
}: LandmarkProps) {
  const group =
    useRef<THREE.Group>(null);

  const [hovered, setHovered] =
    useState(false);

  const clickTimer =
    useRef(0);

  const { playSfx } =
    useAudio();

  useFrame(
    (state, delta) => {
      if (!group.current) {
        return;
      }

      const time =
        state.clock.elapsedTime;

      /* FLOAT */

      group.current.position.y =
        position[1] +
        Math.sin(
          time * 1.7 +
            position[0]
        ) *
          0.12;

      /* ROTATION */

      if (type === "crystal") {
        group.current.rotation.y +=
          delta * 0.7;

        group.current.rotation.x =
          Math.sin(
            time * 1.2
          ) * 0.08;
      } else {
        group.current.rotation.y =
          Math.sin(
            time * 0.7
          ) * 0.12;
      }

      /* SCALE */

      const targetScale =
        hovered
          ? type === "crystal"
            ? 1.25
            : 1.12
          : 1;

      group.current.scale.lerp(
        new THREE.Vector3(
          targetScale,
          targetScale,
          targetScale
        ),
        0.12
      );

      /* BOUNCE */

      if (
        clickTimer.current >
        0
      ) {
        clickTimer.current -=
          delta;

        const progress =
          1 -
          clickTimer.current /
            0.4;

        const bounce =
          Math.sin(
            progress *
              Math.PI
          ) *
          0.2;

        group.current.scale.y =
          targetScale +
          bounce;
      }
    }
  );

  const handleClick = (
    event: any
  ) => {
    event.stopPropagation();

    clickTimer.current =
      0.4;

    playSfx("click");

    window.setTimeout(
      () => {
        onClick();
      },
      160
    );
  };

  return (
    <group
      ref={group}
      position={position}
      onClick={handleClick}
      onPointerOver={(event) => {
        event.stopPropagation();

        if (!hovered) {
          playSfx("hover");
        }

        setHovered(true);

        document.body.style.cursor =
          "pointer";
      }}
      onPointerOut={(event) => {
        event.stopPropagation();

        setHovered(false);

        document.body.style.cursor =
          "default";
      }}
    >
      {/* BOOK */}

      {type === "book" && (
        <group>
          <mesh
            position={[
              -0.2,
              0,
              0,
            ]}
            rotation={[
              0,
              0,
              0.12,
            ]}
          >
            <boxGeometry
              args={[
                0.42,
                0.08,
                0.55,
              ]}
            />

            <meshStandardMaterial
              color={color}
            />
          </mesh>

          <mesh
            position={[
              0.2,
              0,
              0,
            ]}
            rotation={[
              0,
              0,
              -0.12,
            ]}
          >
            <boxGeometry
              args={[
                0.42,
                0.08,
                0.55,
              ]}
            />

            <meshStandardMaterial
              color={color}
            />
          </mesh>
        </group>
      )}

      {/* CAMERA */}

      {type === "camera" && (
        <group>
          <mesh>
            <boxGeometry
              args={[
                0.65,
                0.42,
                0.28,
              ]}
            />

            <meshStandardMaterial
              color={color}
            />
          </mesh>

          <mesh
            position={[
              0,
              0,
              0.18,
            ]}
          >
            <cylinderGeometry
              args={[
                0.16,
                0.16,
                0.08,
                16,
              ]}
            />

            <meshStandardMaterial
              color="#FFFFFF"
            />
          </mesh>

          <mesh
            position={[
              0,
              0,
              0.23,
            ]}
          >
            <cylinderGeometry
              args={[
                0.08,
                0.08,
                0.04,
                16,
              ]}
            />

            <meshStandardMaterial
              color="#374151"
            />
          </mesh>
        </group>
      )}

      {/* ENVELOPE */}

      {type === "envelope" && (
        <group>
          <mesh>
            <boxGeometry
              args={[
                0.7,
                0.45,
                0.08,
              ]}
            />

            <meshStandardMaterial
              color={color}
            />
          </mesh>

          <mesh
            position={[
              0,
              0.08,
              0.06,
            ]}
            rotation={[
              0,
              0,
              Math.PI / 4,
            ]}
          >
            <boxGeometry
              args={[
                0.32,
                0.32,
                0.025,
              ]}
            />

            <meshStandardMaterial
              color="#FFFFFF"
            />
          </mesh>
        </group>
      )}

      {/* MEMORY CORE */}

      {type === "crystal" && (
        <group>
          <mesh>
            <octahedronGeometry
              args={[
                0.7,
                0,
              ]}
            />

            <meshStandardMaterial
              color="#FFFFFF"
              emissive={color}
              emissiveIntensity={
                hovered
                  ? 1.5
                  : 0.7
              }
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>

          <Sparkles
            count={25}
            scale={1.8}
            size={2}
            speed={0.5}
            opacity={
              hovered
                ? 0.95
                : 0.45
            }
            color="#FFF7C2"
          />
        </group>
      )}

      {/* GLOW */}

      {hovered && (
        <pointLight
          color={color}
          intensity={
            type === "crystal"
              ? 3
              : 1.2
          }
          distance={3}
        />
      )}

      {/* LABEL */}

      {hovered && (
        <Html
          position={[
            0,
            1.1,
            0,
          ]}
          center
          distanceFactor={8}
          zIndexRange={[
            100,
            0,
          ]}
        >
          <div
            className="
              bg-white/95
              backdrop-blur-md
              px-4
              py-2
              rounded-xl
              border-2
              border-capsule-navy
              shadow-pixel-sm
              text-capsule-navy
              font-bold
              text-xs
              whitespace-nowrap
              pointer-events-none
              select-none
            "
          >
            {icon && (
              <span className="mr-2">
                {icon}
              </span>
            )}

            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

/* =========================================================
   FLOATING ISLAND
========================================================= */

function FloatingIsland({
  isNight,
}: {
  isNight: boolean;
}) {
  const rocks = useMemo(() => {
    return Array.from(
      { length: 10 },
      (_, index) => {
        const angle =
          (index / 10) *
          Math.PI *
          2;

        const radius =
          7.2 +
          (index % 3) *
            0.45;

        return {
          position: [
            Math.cos(angle) *
              radius,

            -0.1 -
              (index % 2) *
                0.35,

            Math.sin(angle) *
              radius,
          ] as Vec3,

          scale:
            0.22 +
            (index % 4) *
              0.07,
        };
      }
    );
  }, []);

  return (
    <group
      position={[
        0,
        -1.15,
        0,
      ]}
    >
      <mesh>
        <cylinderGeometry
          args={[
            7,
            7,
            0.4,
            32,
          ]}
        />

        <meshStandardMaterial
          color={
            isNight
              ? "#294535"
              : "#88C57A"
          }
          roughness={1}
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.55,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            6.8,
            5.5,
            0.9,
            32,
          ]}
        />

        <meshStandardMaterial
          color={
            isNight
              ? "#33251C"
              : "#8B5A2B"
          }
          roughness={1}
        />
      </mesh>

      {rocks.map(
        (rock, index) => (
          <FloatingRock
            key={index}
            position={
              rock.position
            }
            scale={rock.scale}
            isNight={
              isNight
            }
            index={index}
          />
        )
      )}
    </group>
  );
}

/* =========================================================
   FLOATING ROCK
========================================================= */

function FloatingRock({
  position,
  scale,
  isNight,
  index,
}: {
  position: Vec3;
  scale: number;
  isNight: boolean;
  index: number;
}) {
  const mesh =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) {
      return;
    }

    const time =
      state.clock.elapsedTime +
      index;

    mesh.current.position.y =
      position[1] +
      Math.sin(
        time * 0.8
      ) *
        0.12;

    mesh.current.rotation.x =
      time * 0.2;

    mesh.current.rotation.y =
      time * 0.3;
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={scale}
    >
      <dodecahedronGeometry
        args={[1, 0]}
      />

      <meshStandardMaterial
        color={
          isNight
            ? "#4B5563"
            : "#A0AEC0"
        }
      />
    </mesh>
  );
}

/* =========================================================
   PIXEL TREE
========================================================= */

function PixelTree({
  position,
  isNight,
}: {
  position: Vec3;
  isNight: boolean;
}) {
  const leaves =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!leaves.current) {
      return;
    }

    leaves.current.rotation.z =
      Math.sin(
        state.clock.elapsedTime *
          1.1 +
          position[0]
      ) *
        0.05;
  });

  return (
    <group
      position={position}
    >
      <mesh
        position={[
          0,
          -0.5,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.3,
            0.8,
            0.3,
          ]}
        />

        <meshStandardMaterial
          color={
            isNight
              ? "#4A3728"
              : "#8B4513"
          }
        />
      </mesh>

      <mesh
        ref={leaves}
        position={[
          0,
          0.2,
          0,
        ]}
      >
        <boxGeometry
          args={[
            1.2,
            1.1,
            1.2,
          ]}
        />

        <meshStandardMaterial
          color={
            isNight
              ? "#1A3A17"
              : "#2D5A27"
          }
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   CLOUD
========================================================= */

function PixelCloud({
  position,
  isNight,
}: {
  position: Vec3;
  isNight: boolean;
}) {
  const group =
    useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) {
      return;
    }

    group.current.position.x =
      position[0] +
      Math.sin(
        state.clock.elapsedTime *
          0.08 +
          position[0]
      ) *
        0.5;

    group.current.position.y =
      position[1] +
      Math.sin(
        state.clock.elapsedTime *
          0.5 +
          position[0]
      ) *
        0.12;
  });

  const color = isNight
    ? "#4A5568"
    : "#FFFFFF";

  return (
    <group
      ref={group}
      position={position}
    >
      <mesh>
        <boxGeometry
          args={[
            1.4,
            0.6,
            0.6,
          ]}
        />

        <meshStandardMaterial
          color={color}
        />
      </mesh>

      <mesh
        position={[
          -0.45,
          0.3,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.7,
            0.6,
            0.6,
          ]}
        />

        <meshStandardMaterial
          color={color}
        />
      </mesh>

      <mesh
        position={[
          0.45,
          0.35,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.8,
            0.7,
            0.6,
          ]}
        />

        <meshStandardMaterial
          color={color}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   FIREFLIES
========================================================= */

function Fireflies({
  count = 45,
}: {
  count?: number;
}) {
  const points =
    useRef<THREE.Points>(null);

  const positions =
    useMemo(() => {
      const data =
        new Float32Array(
          count * 3
        );

      for (
        let i = 0;
        i < count;
        i++
      ) {
        data[i * 3] =
          (Math.random() -
            0.5) *
          14;

        data[i * 3 + 1] =
          Math.random() *
            4 -
          0.5;

        data[i * 3 + 2] =
          (Math.random() -
            0.5) *
          14;
      }

      return data;
    }, [count]);

  useFrame((state) => {
    if (!points.current) {
      return;
    }

    points.current.rotation.y =
      state.clock.elapsedTime *
      0.02;

    points.current.position.y =
      Math.sin(
        state.clock.elapsedTime *
          0.4
      ) *
      0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            positions,
            3,
          ]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.08}
        color="#FFF6A8"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

/* =========================================================
   MAIN MEMORY WORLD
========================================================= */

export default function MemoryWorld() {
  const {
    setActiveView,
    language,
    triggerEnding,
    isDarkMode,
  } = useAppStore();

  const t =
    translations[language]
      .world;

  const [
    selectedCharacter,
    setSelectedCharacter,
  ] =
    useState<Character | null>(
      null
    );

  return (
    <div
      className={`
        absolute
        inset-0
        w-full
        h-full
        z-0
        transition-colors
        duration-1000
        ${
          isDarkMode
            ? "bg-indigo-950"
            : "bg-capsule-softBlue"
        }
      `}
    >
      {/* =================================================
          3D WORLD
      ================================================= */}

      <Canvas
        camera={{
          position: [
            0,
            5.2,
            11.5,
          ],
          fov: 42,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference:
            "high-performance",
        }}
      >
        <color
          attach="background"
          args={[
            isDarkMode
              ? "#111827"
              : "#A1C8E9",
          ]}
        />

        <ambientLight
          intensity={
            isDarkMode
              ? 0.25
              : 0.8
          }
        />

        <directionalLight
          position={[
            5,
            10,
            5,
          ]}
          intensity={
            isDarkMode
              ? 0.4
              : 1.2
          }
        />

        <Suspense fallback={null}>

          {/* NIGHT */}

          {isDarkMode && (
            <Stars
              radius={50}
              depth={50}
              count={2500}
              factor={4}
              saturation={0}
              fade
              speed={0.5}
            />
          )}

          {isDarkMode && (
            <Fireflies count={45} />
          )}

          {/* ISLAND */}

          <FloatingIsland
            isNight={
              isDarkMode
            }
          />

          {/* CLOUDS */}

          <PixelCloud
            position={[
              -5,
              4,
              -4,
            ]}
            isNight={
              isDarkMode
            }
          />

          <PixelCloud
            position={[
              5,
              5,
              -2,
            ]}
            isNight={
              isDarkMode
            }
          />

          {/* TREES */}

          <PixelTree
            position={[
              -4.8,
              -0.05,
              -3.3,
            ]}
            isNight={
              isDarkMode
            }
          />

          <PixelTree
            position={[
              4.8,
              -0.05,
              3,
            ]}
            isNight={
              isDarkMode
            }
          />

          {/* =================================================
              9 FRIENDS
          ================================================= */}

          {CHARACTERS.map(
            (character) => (
              <PixelCharacter
                key={
                  character.id
                }
                {...character}
                onClick={() =>
                  setSelectedCharacter(
                    character
                  )
                }
              />
            )
          )}

          {/* =================================================
              CENTRAL GOODBYE CRYSTAL
          ================================================= */}

          <LandmarkObject
            type="crystal"
            position={[
              0,
              1.55,
              -0.3,
            ]}
            color="#FFFFFF"
            name={
              t.objGoodbye
            }
            icon="✨"
            onClick={
              triggerEnding
            }
          />

          {/* =================================================
              CENTRAL MEMORY OBJECTS
          ================================================= */}

          <LandmarkObject
            type="book"
            position={[
              -1.15,
              -0.78,
              -0.65,
            ]}
            color="#FDEBA6"
            name={
              t.objTimeline
            }
            icon="📖"
            onClick={() =>
              setActiveView(
                "timeline"
              )
            }
          />

          <LandmarkObject
            type="camera"
            position={[
              0,
              -0.62,
              -0.7,
            ]}
            color="#F4AAB9"
            name={
              t.objGallery
            }
            icon="📸"
            onClick={() =>
              setActiveView(
                "gallery"
              )
            }
          />

          <LandmarkObject
            type="envelope"
            position={[
              1.15,
              -0.78,
              -0.65,
            ]}
            color="#CDB4DB"
            name={
              t.objMessages
            }
            icon="💌"
            onClick={() =>
              setActiveView(
                "messages"
              )
            }
          />
        </Suspense>

        {/* =================================================
            CAMERA
        ================================================= */}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.12}
          maxPolarAngle={
            Math.PI / 2 -
            0.06
          }
          minPolarAngle={
            Math.PI / 4.5
          }
        />
      </Canvas>

      {/* ===================================================
          CHARACTER CHAT
      =================================================== */}

      {selectedCharacter && (
        <CharacterChat
          character={
            selectedCharacter
          }
          onClose={() =>
            setSelectedCharacter(
              null
            )
          }
        />
      )}
    </div>
  );
}