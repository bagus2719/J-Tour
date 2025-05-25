const BASE_URL = 'https://6832befcc3f2222a8cb35ee1.mockapi.io/api';

// --- DESTINATIONS ---

// GET semua destinasi
export async function getDestinations() {
  const response = await fetch(`${BASE_URL}/destinations`);
  if (!response.ok) throw new Error('Gagal mengambil data destinasi dari server');
  return response.json();
}

// GET destinasi berdasarkan id
export async function getDestinationById(id) {
  const response = await fetch(`${BASE_URL}/destinations/${id}`);
  if (!response.ok) throw new Error('Gagal mengambil data destinasi berdasarkan ID');
  return response.json();
}

// POST destinasi baru
export async function postDestination(data) {
  const response = await fetch(`${BASE_URL}/destinations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      location: data.location,
      category: data.category,
      description: data.description,
      facilities: data.facilities,
      image: data.image,
    }),
  });

  if (!response.ok) throw new Error('Gagal mengirim data destinasi ke server');
  return response.json();
}

// PUT update destinasi berdasarkan id
export async function putDestination(id, data) {
  const response = await fetch(`${BASE_URL}/destinations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      location: data.location,
      category: data.category,
      description: data.description,
      facilities: data.facilities,
      image: data.image,
    }),
  });

  if (!response.ok) throw new Error('Gagal mengupdate data destinasi');
  return response.json();
}

// DELETE destinasi berdasarkan id
export async function deleteDestination(id) {
  const response = await fetch(`${BASE_URL}/destinations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Gagal menghapus data destinasi');
  return response.json();
}

// --- NEWS ---

// GET semua berita
export async function getNews() {
  const response = await fetch(`${BASE_URL}/news`);
  if (!response.ok) throw new Error('Gagal mengambil data berita dari server');
  return response.json();
}

// GET berita berdasarkan id
export async function getNewsById(id) {
  const response = await fetch(`${BASE_URL}/news/${id}`);
  if (!response.ok) throw new Error('Gagal mengambil data berita berdasarkan ID');
  return response.json();
}

// POST berita baru
export async function postNews(data) {
  const response = await fetch(`${BASE_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: data.title,
      category: data.category,
      date: data.date,
      content: data.content,
      image: data.image,
    }),
  });

  if (!response.ok) throw new Error('Gagal mengirim data berita ke server');
  return response.json();
}

// PUT update berita berdasarkan id
export async function putNews(id, data) {
  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: data.title,
      category: data.category,
      date: data.date,
      content: data.content,
      image: data.image,
    }),
  });

  if (!response.ok) throw new Error('Gagal mengupdate data berita');
  return response.json();
}

// DELETE berita berdasarkan id
export async function deleteNews(id) {
  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Gagal menghapus data berita');
  return response.json();
}
