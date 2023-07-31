export interface Options {
  /**
   * Dirs
   *
   * @default 'src/assets/images'
   */
  dirs?: string | Record<string, string> | (string | Record<string, string>)[]

  /**
   * Extensions
   *
   * @default ['jpg', 'jpeg', 'png', 'svg', 'webp']
   */
  extensions?: string[]

  /**
   * Compiler
   *
   * @default 'vue3'
   */
  compiler?: 'vue2' | 'vue3'
}

export interface Dir {
  alias: string
  path: string
}

export interface ResolvedOptions extends Omit<Required<Options>, 'dirs'> {
  dirs: Dir[]
}
