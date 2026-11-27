/* Desi Mirror · look.js  (DM3014 Final Project · Cabrini Lydia Lourdu Leo)
   Everything you "wear" in the mirror: shimmer, blush, bindi, jhumkas, bangles
   and the paper-doll outfit. All of it follows the face / hand keypoints.
   The look stays on through every chapter, so it shows up in the photo.
*/

const look = {
  bindi: -1, // index into ART.bindis, -1 = none
  shimmer: false,
  blush: false,
  jhumka: -1, // index into ART.jhumkas, -1 = none
  bangles: -1, // index into ART.bangles, -1 = none
  outfit: -1, // index into ART.outfits
};

// face landmark index lists
const EYE_L_UP = [33, 246, 161, 160, 159, 158, 157, 173, 133];
const EYE_R_UP = [263, 466, 388, 387, 386, 385, 384, 398, 362];
const BROW_L = [70, 63, 105, 66, 107];
const BROW_R = [300, 293, 334, 296, 336];

let jhumkaSwing = { l: 0, lv: 0, r: 0, rv: 0, lastX: null };

// video pixel -> screen position inside the mirror
function vm(p) {
  return { x: L.vx + p.x * L.vs, y: L.vy + p.y * L.vs };
}

function drawLook() {
  const F = faceInfo();
  if (F) {
    if (look.blush) drawBlushOn(F);
    if (look.shimmer) drawShimmer(F);
    if (look.outfit >= 0) drawOutfitOn(F);
  }
  if (look.bangles >= 0) drawBanglesOn();
  if (F) {
    if (look.jhumka >= 0) drawJhumkasOn(F);
    if (look.bindi >= 0) drawBindiOn(F);
  }
}

function drawShimmer(F) {
  push();
  noStroke();
  for (const [up, brow] of [
    [EYE_L_UP, BROW_L],
    [EYE_R_UP, BROW_R],
  ]) {
    // band between the upper lid and halfway to the brow
    const pts = [];
    for (const i of up) pts.push(vm(fk(i)));
    const bp = brow.map((i) => vm(fk(i)));
    const lidTop = up
      .slice()
      .reverse()
      .map((i, k) => {
        const p = vm(fk(i));
        const b = bp[Math.min(bp.length - 1, Math.floor((k / up.length) * bp.length))];
        return { x: p.x + (b.x - p.x) * 0.45, y: p.y + (b.y - p.y) * 0.45 };
      });
    blendMode(SCREEN);
    fill(243, 200, 90, 110);
    beginShape();
    for (const p of pts.concat(lidTop)) vertex(p.x, p.y);
    endShape(CLOSE);
    blendMode(BLEND);
    // sparkles
    for (let k = 0; k < 5; k++) {
      const p = pts[(k * 2 + frameCount) % pts.length];
      fill(255, 250, 220, 120 + 120 * Math.sin(frameCount * 0.2 + k));
      ellipse(p.x + random(-3, 3), p.y - random(2, 8), 2.5, 2.5);
    }
  }
  pop();
}

function drawBlushOn(F) {
  push();
  noStroke();
  blendMode(MULTIPLY);
  const r = F.w * L.vs * 0.2;
  for (const i of [205, 425]) {
    const p = vm(fk(i));
    for (let k = 5; k > 0; k--) {
      fill(240, 120, 150, 18);
      ellipse(p.x, p.y, (r * k) / 3, (r * k) / 4);
    }
  }
  blendMode(BLEND);
  pop();
}

function drawBindiOn(F) {
  const p = vm(lerpPt(fk(9), fk(151), 0.3));
  const s = F.w * L.vs * (look.bindi === 2 ? 0.07 : 0.13);
  push();
  translate(p.x, p.y);
  rotate(F.roll);
  imageMode(CENTER);
  image(ART.bindis[look.bindi], 0, 0, s, s);
  pop();
}

function drawJhumkasOn(F) {
  const fw = F.w * L.vs;
  // pendulum swing: the jhumkas lag behind when you move your head
  const cx = F.centre.x;
  if (jhumkaSwing.lastX !== null) {
    const v = (cx - jhumkaSwing.lastX) * L.vs;
    for (const s of ["l", "r"]) {
      jhumkaSwing[s + "v"] += -v * 0.004 - jhumkaSwing[s] * 0.08;
      jhumkaSwing[s + "v"] *= 0.9;
      jhumkaSwing[s] = constrain(jhumkaSwing[s] + jhumkaSwing[s + "v"], -0.7, 0.7);
    }
  }
  jhumkaSwing.lastX = cx;

  const ears = [
    { top: 234, low: 132, vis: F.leftVis, s: "l" },
    { top: 454, low: 361, vis: F.rightVis, s: "r" },
  ];
  const c = vm(F.centre);
  for (const e of ears) {
    if (e.vis < 0.32) continue; // that ear is turned away
    let p = vm(lerpPt(fk(e.top), fk(e.low), 0.6));
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const d = Math.hypot(dx, dy) || 1;
    p = { x: p.x + (dx / d) * fw * 0.035, y: p.y + (dy / d) * fw * 0.035 };
    const J = ART.jhumkas[look.jhumka];
    const h = fw * J.len;
    const w = (h * J.img.width) / J.img.height;
    push();
    translate(p.x, p.y);
    rotate(jhumkaSwing[e.s]);
    image(J.img, -w / 2, -h * 0.04, w, h);
    pop();
  }
}

function drawBanglesOn() {
  const cols = [PAL.sindoor, PAL.gold, "#1f8f4e", PAL.gold, PAL.rani, PAL.gold];
  for (const h of TRACK.hands) {
    const w = vm(h.kp[0]);
    const m = vm(h.kp[9]);
    const hs = Math.hypot(m.x - w.x, m.y - w.y);
    const ax = (w.x - m.x) / (hs || 1);
    const ay = (w.y - m.y) / (hs || 1);
    const ang = Math.atan2(ay, ax);
    push();
    const B = ART.bangles[look.bangles].img;
    if (B) {
      // the stack runs down the forearm from just below the wrist
      const bw = hs * 1.05;
      const bh = bw * (B.height / B.width);
      translate(w.x + ax * (hs * 0.15 + bh / 2), w.y + ay * (hs * 0.15 + bh / 2));
      rotate(ang - HALF_PI);
      imageMode(CENTER);
      image(B, 0, 0, bw, bh);
    } else {
      noFill();
      for (let k = 0; k < 6; k++) {
        const along = hs * (0.2 + k * 0.1);
        push();
        translate(w.x + ax * along, w.y + ay * along);
        rotate(ang);
        stroke(PAL.ink);
        strokeWeight(hs * 0.09 + 2);
        ellipse(0, 0, hs * 0.28, hs * 0.95);
        stroke(cols[k]);
        strokeWeight(hs * 0.09);
        ellipse(0, 0, hs * 0.28, hs * 0.95);
        pop();
      }
    }
    pop();
  }
}

function drawOutfitOn(F) {
  const O = ART.outfits[look.outfit];
  const img = O.img;
  const chin = vm(fk(152));
  const fw = F.w * L.vs;
  // paper-doll: scale so the shoulders are O.span face-widths across,
  // then hang it O.drop face-widths below the chin
  const w = (fw * O.span) / O.shoulder;
  const h = (w * img.height) / img.width;
  push();
  translate(chin.x, chin.y + fw * O.drop);
  rotate(F.roll * 0.5);
  image(img, -w * O.cx, 0, w, h);
  pop();
}

