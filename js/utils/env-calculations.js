// ===== Environmental Calculations =====
// Constants and functions for environmental impact calculations

const EnvCalculations = {
    // Constants for environmental calculations
    CO2_TO_OXYGEN_RATIO: 2.92,  // kg of oxygen per kg of CO2
    WATER_CONSERVATION_PER_KG_CO2: 16,  // liters of water conserved per kg of CO2

    // Calculate oxygen production from CO2 absorption
    calculateOxygen: function(co2Kg) {
        return Math.round(co2Kg * this.CO2_TO_OXYGEN_RATIO);
    },

    // Calculate water conservation from CO2 absorption
    calculateWater: function(co2Kg) {
        return Math.round(co2Kg * this.WATER_CONSERVATION_PER_KG_CO2);
    },

    // Calculate total environmental impact
    calculateImpact: function(treesPlanted, co2PerTree = 25) {
        const totalCo2 = treesPlanted * co2PerTree;
        return {
            co2: totalCo2,
            oxygen: this.calculateOxygen(totalCo2),
            water: this.calculateWater(totalCo2)
        };
    },

    // Format environmental values with units
    formatCo2: function(kg) {
        return `${FormatHelpers.formatNumber(kg)} kg`;
    },

    formatOxygen: function(kg) {
        return `${FormatHelpers.formatNumber(kg)} kg`;
    },

    formatWater: function(liters) {
        return `${FormatHelpers.formatNumber(liters)} L`;
    }
};

// Export for use in other modules
window.EnvCalculations = EnvCalculations;
