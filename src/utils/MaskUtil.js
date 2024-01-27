/* eslint-disable no-plusplus */
class MaskUtil {

  static applyCpfMask(value) {
    const numericValue = value.replace(/\D/g, '');
    return this.applyGenericMask(numericValue, '###.###.###-##')
  }

  static applyCnpjMask(value) {
    const numericValue = value.replace(/\D/g, '');
    return this.applyGenericMask(numericValue, '##.###.###/####-##');
  }

  static applyCpfCnpjMask(value) {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    // Aplica a máscara independentemente do número de caracteres
    if (numericValue.length <= 11) {
      // Máscara para CPF
      return this.applyCpfMask(numericValue);
    }
    // Máscara para CNPJ
    return this.applyCnpjMask(numericValue)
  }

  static applyCepMask(value) {
    const numericValue = value.replace(/\D/g, '');

    return this.applyGenericMask(numericValue, "#####-###")
  }

  static applyTelefoneMask(value) {
    const numericValue = value.replace(/\D/g, '');

    return this.applyGenericMask(numericValue, "#####-####")
  }

  static applyMonetaryMask(value) {
    const numericValue = String(value);

    // Encontra a posição do ponto decimal
    const decimalPosition = numericValue.indexOf('.');

    // Separa a parte inteira e parte decimal
    let integerPart; let decimalPart;
    if (decimalPosition !== -1) {
      integerPart = numericValue.slice(0, decimalPosition);
      decimalPart = numericValue.slice(decimalPosition + 1).padEnd(2, '0');
    } else {
      integerPart = numericValue;
      decimalPart = '00';
    }

    // Aplica a máscara monetária
    const formattedValue = `${this.applyGenericMask(integerPart, '###.###.###')},${decimalPart}`;

    return formattedValue;
  }

  static applyGenericMask(value, mask) {
    let maskedValue = '';
    let i = 0;
    let j = 0;

    while (i < value.length && j < mask.length) {
      if (mask[j] === '#') {
        maskedValue += value[i];
        i++;
      } else {
        maskedValue += mask[j];
      }
      j++;
    }

    return maskedValue;
  }
}

export default MaskUtil;
