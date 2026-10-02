import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'registrations';

function generateId() {
  return 'BG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function getAllRegistrations() {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const regs = [];
    querySnapshot.forEach((doc) => {
      regs.push({ id: doc.id, ...doc.data() });
    });
    return regs;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
}

export async function addRegistration(data) {
  try {
    const newReg = {
      ...data,
      bgId: generateId(), // keep a custom readable ID
      timestamp: new Date().toISOString(), // store as string for simplicity with charts
      status: 'pending',
      paymentStatus: 'pending',
      utr: data.utr || '',
      screenshotUrl: data.screenshotUrl || '',
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newReg);
    return { id: docRef.id, ...newReg };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function updateRegistration(id, updates) {
  try {
    const regRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(regRef, updates);
    return true;
  } catch (e) {
    console.error("Error updating document: ", e);
    return false;
  }
}

export async function deleteRegistration(id) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (e) {
    console.error("Error deleting document: ", e);
    return false;
  }
}

export function getAnalytics(regs) {
  const total = regs.length;
  const verified = regs.filter(r => r.status === 'verified').length;
  const pending = regs.filter(r => r.status === 'pending').length;
  const rejected = regs.filter(r => r.status === 'rejected').length;
  const totalRevenue = regs.filter(r => r.status === 'verified').reduce((sum, r) => sum + (r.totalFee || 0), 0);
  const totalMembers = regs.reduce((sum, r) => sum + (r.teamSize || 0), 0);

  // Branch breakdown
  const branchCount = {};
  regs.forEach(r => {
    const lead = r.lead;
    if (lead?.branch) branchCount[lead.branch] = (branchCount[lead.branch] || 0) + 1;
    (r.members || []).forEach(m => {
      if (m.branch) branchCount[m.branch] = (branchCount[m.branch] || 0) + 1;
    });
  });

  // Year breakdown
  const yearCount = {};
  regs.forEach(r => {
    const lead = r.lead;
    if (lead?.year) yearCount[lead.year] = (yearCount[lead.year] || 0) + 1;
    (r.members || []).forEach(m => {
      if (m.year) yearCount[m.year] = (yearCount[m.year] || 0) + 1;
    });
  });

  // Team size breakdown
  const sizeCount = { 4: 0, 5: 0, 6: 0 };
  regs.forEach(r => {
    const s = r.teamSize;
    if (s >= 4 && s <= 6) sizeCount[s]++;
  });

  // Daily registrations (last 7 days)
  const dailyMap = {};
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    dailyMap[key] = 0;
  }
  regs.forEach(r => {
    const d = new Date(r.timestamp);
    const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    if (key in dailyMap) dailyMap[key]++;
  });

  return {
    total, verified, pending, rejected,
    totalRevenue, totalMembers,
    branchCount, yearCount, sizeCount,
    dailyData: Object.entries(dailyMap).map(([date, count]) => ({ date, count })),
  };
}
