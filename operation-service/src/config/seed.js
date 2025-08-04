import Operation from '../models/Operation.js';

export async function seedOperations() {
  const operations = [
    { type: 'addition', cost: 1 },
    { type: 'subtraction', cost: 1 },
    { type: 'multiplication', cost: 2 },
    { type: 'division', cost: 2 },
    { type: 'square_root', cost: 3 },
    { type: 'random_string', cost: 5 },
  ];

  for (const op of operations) {
    const exists = await Operation.findOne({ where: { type: op.type } });
    if (!exists) {
      await Operation.create(op);
      console.log(`Operación ${op.type} registrada.`);
    }
  }
}
