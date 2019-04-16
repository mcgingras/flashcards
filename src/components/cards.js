import React, { useState } from 'react';
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-with-gesture'

const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100, xper: 20 });
const from = i => ({ x: 0, y: i * -4, rot: 0, scale: 1.5, y: -1000, xper: 10 });
const trans = (r, s, x) => `perspective(1500px) rotateX(${x}deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;
const flat = (r, s) => `perspective(1500px) rotateX(5deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

const cards = [
  "testing the first flashcard.",
  "testing the second flashcard.",
  "testing the third flashcard.",
  "testing the fourth flashcard."
]


const Cards = () => {
  const [gone] = useState(() => new Set())
  const [isFlipped, setFlip] = useState(false);
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) }))
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) {
      gone.add(index);
      setFlip(false);
    }
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0
      const xper = isGone ? 20 : down ? 10 : 20
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0)
      const scale = down ? 1.1 : 1
      return { x, xper, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 500)
  });

  return props.map(({ x, y, xper, rot, scale }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      <animated.div {...bind(i)}
      style={{transform: interpolate([rot, scale, xper], trans)}}
      onClick={() => {setFlip(true)}}
      >
        {cards[i]}
      </animated.div>
    </animated.div>
  ))
}

export default Cards;
