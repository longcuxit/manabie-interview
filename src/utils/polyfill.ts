declare global {
  interface ObjectConstructor {
    keys<O>(object: O): (keyof O)[];
  }
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// export function applyMixins(derived: any, ...bases: any[]) {
//   bases.forEach((base) => {
//     const define = (name: string) => {
//       if (name !== "constructor") {
//         Object.defineProperty(
//           derived,
//           name,
//           Object.getOwnPropertyDescriptor(base, name)!
//         );
//       }
//     };

//     while (base) {
//       Object.getOwnPropertyNames(base).forEach(define);
//       base = Object.getPrototypeOf(base);
//     }
//   });
// }

export {};
