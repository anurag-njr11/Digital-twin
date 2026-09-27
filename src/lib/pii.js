// Shared by the data tests, the context pack build and the twin's output check.

// Indian mobile numbers with or without +91, and any 10+ digit run.
export const PHONE = /(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\d{10,}/

export const EMAIL = /[\w.+-]+@[\w-]+(\.[\w-]+)+/g
