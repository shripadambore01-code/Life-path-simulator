export function normalSample(mean, stddev) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stddev + mean;
}

export function logNormalSample(median, sigma) {
    const mu = Math.log(median);
    const normal = normalSample(mu, sigma);
    return Math.exp(normal);
}

export function bernoulliSample(probability) {
    return Math.random() < probability;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function uniformSample(min, max) {
    return Math.random() * (max - min) + min;
}
