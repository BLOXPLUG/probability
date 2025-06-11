import Object from "@rbxts/object-utils";

export namespace Weight {
	/**
	 *
	 * @param weights
	 * @param skewFactor - Controls the weight distribution: 0 for equal distribution,
	 * positive for skewing towards larger weights, and negative for skewing towards
	 * smaller weights.
	 * @returns All weights normalized to sum up to 1.
	 */
	export function skew(weights: number[], skewFactor = 0) {
		const baseFactor = 1 - skewFactor;
		weights = weights.map((weight) => weight ** baseFactor); // Apply skew factor to weights
		const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

		return weights.map((weight) => (weight /= totalWeight)); // Normalize weights
	}

	export function fromDictionary<T extends Record<string, number>>(dictionary: T) {
		const keys = Object.keys(dictionary);
		const weights = skew((keys as string[]).map((key) => dictionary[key]));

		return $tuple(keys, weights)
	}

	export function getRandom<T>(choices: T[], weights: number[], random = new Random()): T | undefined {
		const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
		if (totalWeight === 0) return undefined;
		const normalizedWeights = weights.map((weight) => weight / totalWeight);

		let counter = random.NextNumber(0, 1);
		for (let i = 0; i < normalizedWeights.size(); i++) {
			counter -= normalizedWeights[i];
			if (counter <= 0) {
				return choices[i];
			}
		}
	}
}