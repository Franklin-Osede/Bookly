const { Client } = require('pg');

async function createBusiness() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'domoblock',
    password: '',
    database: 'bookly_db',
  });

  try {
    await client.connect();
    console.log('Conectado a PostgreSQL');

    // Crear un negocio de hotel
    const businessId = '550e8400-e29b-41d4-a716-446655440000';
    const insertQuery = `
      INSERT INTO businesses (id, name, email, phone, street, city, state, zipCode, country, type, description, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING
    `;

    const values = [
      businessId,
      'Hotel Paradise',
      'info@hotelparadise.com',
      '+1234567890',
      '123 Ocean Drive',
      'Miami',
      'FL',
      '33101',
      'USA',
      'HOTEL',
      'Luxury hotel with ocean views',
      true,
      new Date(),
      new Date()
    ];

    const result = await client.query(insertQuery, values);
    console.log('Negocio creado exitosamente:', result.rowCount > 0 ? 'Insertado' : 'Ya existía');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

createBusiness();




