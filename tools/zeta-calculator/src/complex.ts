/** Complex number utilities for analytic function evaluation. */
export class C {
  constructor(
    public re: number,
    public im = 0,
  ) {}

  static from(re: number, im = 0): C {
    return new C(re, im)
  }

  static zero(): C {
    return new C(0, 0)
  }

  static one(): C {
    return new C(1, 0)
  }

  add(b: C): C {
    return new C(this.re + b.re, this.im + b.im)
  }

  sub(b: C): C {
    return new C(this.re - b.re, this.im - b.im)
  }

  neg(): C {
    return new C(-this.re, -this.im)
  }

  mul(b: C): C {
    return new C(
      this.re * b.re - this.im * b.im,
      this.re * b.im + this.im * b.re,
    )
  }

  div(b: C): C {
    const d = b.re * b.re + b.im * b.im
    if (d === 0) {
      return new C(Number.NaN, Number.NaN)
    }
    return new C(
      (this.re * b.re + this.im * b.im) / d,
      (this.im * b.re - this.re * b.im) / d,
    )
  }

  conj(): C {
    return new C(this.re, -this.im)
  }

  abs(): number {
    return Math.hypot(this.re, this.im)
  }

  arg(): number {
    return Math.atan2(this.im, this.re)
  }

  exp(): C {
    const r = Math.exp(this.re)
    return new C(r * Math.cos(this.im), r * Math.sin(this.im))
  }

  log(): C {
    return new C(Math.log(this.abs()), this.arg())
  }

  pow(s: C): C {
    if (this.re === 0 && this.im === 0) {
      return C.zero()
    }
    return this.log().mul(s).exp()
  }

  static pow(a: number, s: C): C {
    if (a === 0) {
      return C.zero()
    }
    if (a < 0) {
      return C.from(Math.abs(a), 0).pow(s).mul(C.from(Math.cos(Math.PI * s.re), Math.sin(Math.PI * s.re)))
    }
    return C.from(a, 0).pow(s)
  }

  static sin(z: C): C {
    const i = C.from(0, 1)
    const iz = i.mul(z)
    const eiz = iz.exp()
    const emiz = iz.neg().exp()
    return eiz.sub(emiz).div(i.mul(C.from(2, 0)))
  }

  static cos(z: C): C {
    const i = C.from(0, 1)
    const iz = i.mul(z)
    const eiz = iz.exp()
    const emiz = iz.neg().exp()
    return eiz.add(emiz).div(C.from(2, 0))
  }

  isFinite(): boolean {
    return Number.isFinite(this.re) && Number.isFinite(this.im)
  }

  toString(precision = 8): string {
    if (!this.isFinite()) {
      return '∞'
    }
    const format = (value: number) => {
      if (Math.abs(value) < 1e-12) {
        return '0'
      }
      return value.toPrecision(precision)
    }
    if (Math.abs(this.im) < 1e-12) {
      return format(this.re)
    }
    if (Math.abs(this.re) < 1e-12) {
      return `${format(this.im)}i`
    }
    const sign = this.im >= 0 ? '+' : '-'
    return `${format(this.re)} ${sign} ${format(Math.abs(this.im))}i`
  }
}
