//  Define the  timer states
export type Mode = "work" | "shortBreke" |"longBreke";
// why we use a Union Type. TypeScript locks this down. If you accidentally type mode = 'lunch', 
// the TypeScript compiler will immediately stop you and throw an error before your app even runs.

export interface Settings{
        durations: Record<Mode ,number>
        sessonBeforeLongBreke: number
    //Record utility is a TypeScript shortcut. 
    // record explicitly tells the computer: "The durations object must have exactly three keys (work, shortBreak, longBreak), 
    // and every single one of those keys must hold a number representing seconds."
}

//session is define the blueprint for a completed history item
export interface Session{
        id: string; // A unique identifier for differnt user
        mode: Mode; // mode that tell which mode recorded
        completedAt: string; // tell the time sesssion ended 
};

// TypeScript types only exist during development.\,
//  it only wathces the code writeing   but doesn't ship to the browser