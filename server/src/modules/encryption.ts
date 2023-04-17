import bcryptjs from "bcryptjs";

/**
 * Converts an input string to a salted hash using the given salt rounds
 * @param input String to be hashed
 * @param saltRounds Number of salt rounds (default is 10)
 * @returns The desired salted hash (60 chars long)
 */
async function makeHash(input: string, saltRounds: number = 10): Promise<string> {
    try {
        let salt: string = await bcryptjs.genSalt(saltRounds);
        return await bcryptjs.hash(input, salt);
    } catch (error) {
        console.log(error);
        return "";
    }
}

/**
 * Checks whether the input string matches the given hash
 * @param inputString Input string to check
 * @param hash Hash to be checked against input string
 * @returns true if there is a match, false if there's no match or an error occurred
 */
async function verifyHash(inputString: string, hash: string): Promise<boolean> {
    try {
        return await bcryptjs.compare(inputString, hash);
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { makeHash, verifyHash };
