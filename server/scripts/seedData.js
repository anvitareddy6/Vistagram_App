// const mongoose = require('mongoose');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });

// // Import models
// const Post = require('../models/Post');

// // Sample data for seeding
// const seedPosts = [
//   {
//     username: "nature_wanderer",
//     image: "seed7.jpg",
//     caption: "Hidden gem alert! Found this secret waterfall trail in Marin County. Sometimes the best adventures are off the beaten path 💧 #waterfall #marin #hiking #hiddengem #adventure",
//     likes: 145,
//     shares: 34,
//     likedBy: ['user_fgh890', 'user_ijk123', 'user_lmn456'],
//     location: {
//       name: "Marin County",
//       coordinates: [-122.7633, 38.0834]
//     },
//     tags: ['waterfall', 'marin', 'hiking', 'hiddengem', 'adventure'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
//     updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
//   },
//   {
//     username: "architecture_lover",
//     image: "seed8.jpg",
//     caption: "The Victorian painted ladies on Alamo Square are architectural poetry! Each house tells its own story 🏠 #victorian #alamosquare #architecture #paintedladies #history",
//     likes: 112,
//     shares: 19,
//     likedBy: ['user_opq789', 'user_rst012'],
//     location: {
//       name: "Alamo Square Park",
//       coordinates: [-122.4335, 37.7766]
//     },
//     tags: ['victorian', 'alamosquare', 'architecture', 'paintedladies', 'history'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
//     updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
//   },
//   {
//     username: "market_explorer",
//     image: "seed9.jpg",
//     caption: "Saturday vibes at Ferry Building Marketplace! Fresh produce, artisanal goods, and the best energy in the city 🥬 #ferrybuilding #farmersmarket #fresh #saturday #local",
//     likes: 98,
//     shares: 28,
//     likedBy: ['user_uvw345', 'user_xyz678', 'user_abc901'],
//     location: {
//       name: "Ferry Building Marketplace",
//       coordinates: [-122.3938, 37.7956]
//     },
//     tags: ['ferrybuilding', 'farmersmarket', 'fresh', 'saturday', 'local'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
//     updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
//   },
//   {
//     username: "golden_hour_chaser",
//     image: "seed10.jpg",
//     caption: "Another spectacular sunset at Baker Beach with the Golden Gate Bridge as the perfect backdrop! Never gets old 🌅 #bakerbeach #goldengatebridge #sunset #spectacular #goldengate",
//     likes: 189,
//     shares: 42,
//     likedBy: ['user_def234', 'user_ghi567', 'user_jkl890', 'user_mno123'],
//     location: {
//       name: "Baker Beach",
//       coordinates: [-122.4843, 37.7938]
//     },
//     tags: ['bakerbeach', 'goldengatebridge', 'sunset', 'spectacular', 'goldengate'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
//     updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
//   },
//   {
//     username: "tech_explorer",
//     image: "seed11.jpg",
//     caption: "Exploring the innovation at the Exploratorium! Science and art coming together in the most beautiful way 🔬 #exploratorium #science #innovation #learning #pierrj9",
//     likes: 76,
//     shares: 15,
//     likedBy: ['user_pqr456', 'user_stu789'],
//     location: {
//       name: "Exploratorium",
//       coordinates: [-122.3979, 37.8010]
//     },
//     tags: ['exploratorium', 'science', 'innovation', 'learning', 'pier15'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
//     updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
//   },
//   {
//     username: "bridge_enthusiast",
//     image: "seed12.jpg",
//     caption: "Walking across the Golden Gate Bridge never loses its magic! The engineering marvel and the views are unmatched 🌉 #goldengatebridge #walking #engineering #views #iconic",
//     likes: 267,
//     shares: 58,
//     likedBy: ['user_vwx012', 'user_yza345', 'user_bcd678', 'user_efg901', 'user_hij234'],
//     location: {
//       name: "Golden Gate Bridge",
//       coordinates: [-122.4786, 37.8199]
//     },
//     tags: ['goldengatebridge', 'walking', 'engineering', 'views', 'iconic'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
//     updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
//   },
//   {
//     username: "neighborhood_walker",
//     image: "seed13.jpg",
//     caption: "Getting lost in the colorful streets of Chinatown! Every corner has a story and amazing food 🏮 #chinatown #culture #food #neighborhood #exploration",
//     likes: 134,
//     shares: 25,
//     likedBy: ['user_klm567', 'user_nop890', 'user_qrs123'],
//     location: {
//       name: "Chinatown San Francisco",
//       coordinates: [-122.4058, 37.7941]
//     },
//     tags: ['chinatown', 'culture', 'food', 'neighborhood', 'exploration'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
//     updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
//   },
//   {
//     username: "park_lover",
//     image: "seed14.jpg",
//     caption: "Perfect picnic spot at Dolores Park with amazing city views! San Francisco's outdoor living room 🌳 #dolorespark #picnic #cityviews #outdoor #community",
//     likes: 87,
//     shares: 16,
//     likedBy: ['user_tuv456', 'user_wxy789'],
//     location: {
//       name: "Dolores Park",
//       coordinates: [-122.4269, 37.7596]
//     },
//     tags: ['dolorespark', 'picnic', 'cityviews', 'outdoor', 'community'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
//     updatedAt: new Date(Date.now() - 30 * 60 * 1000)
//   },
//   {
//     username: "fishermans_wharf_fan",
//     image: "seed15.jpg",
//     caption: "Sea lions taking over Pier 39! Nature reclaiming the city in the most adorable way 🦭 #pier39 #sealions #wildlife #fishermanswharf #nature",
//     likes: 198,
//     shares: 37,
//     likedBy: ['user_zab012', 'user_cde345', 'user_fgh678', 'user_ijk901'],
//     location: {
//       name: "Pier 39",
//       coordinates: [-122.4096, 37.8086]
//     },
//     tags: ['pier39', 'sealions', 'wildlife', 'fishermanswharf', 'nature'],
//     isActive: true,
//     createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
//     updatedAt: new Date(Date.now() - 15 * 60 * 1000)
//   }
// ];


// // Function to seed the database
// const seedDatabase = async () => {
//   try {
//     console.log('🌱 Starting database seeding...');

//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vistagram');
//     console.log('✅ Connected to MongoDB');

//     // Clear existing posts
//     await Post.deleteMany({});
//     console.log('🗑️  Cleared existing posts');

//     // Create placeholder images
//     // await createPlaceholderImages();

//     // Insert seed posts
//     const insertedPosts = await Post.insertMany(seedPosts);
//     console.log(`✅ Successfully seeded ${insertedPosts.length} posts`);

//     // Display summary
//     console.log('\n📊 Seeding Summary:');
//     console.log(`• Total posts: ${insertedPosts.length}`);
//     console.log(`• Total likes: ${seedPosts.reduce((sum, post) => sum + post.likes, 0)}`);
//     console.log(`• Total shares: ${seedPosts.reduce((sum, post) => sum + post.shares, 0)}`);
//     console.log(`• Unique users: ${[...new Set(seedPosts.map(post => post.username))].length}`);
//     console.log(`• Total locations: ${seedPosts.filter(post => post.location).length}`);
//     console.log(`• Total tags: ${[...new Set(seedPosts.flatMap(post => post.tags))].length}`);

//     console.log('\n🎉 Database seeding completed successfully!');
//     console.log('\n🚀 You can now start your server and see the sample posts!');
    
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//     process.exit(1);
//   } finally {
//     // Close database connection
//     await mongoose.connection.close();
//     console.log('📝 Database connection closed');
//     process.exit(0);
//   }
// };

// // Function to clear database
// const clearDatabase = async () => {
//   try {
//     console.log('🧹 Clearing database...');

//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vistagram');
//     console.log('✅ Connected to MongoDB');

//     // Clear all posts
//     const result = await Post.deleteMany({});
//     console.log(`🗑️  Deleted ${result.deletedCount} posts`);


//     console.log('✅ Database cleared successfully!');
    
//   } catch (error) {
//     console.error('❌ Error clearing database:', error);
//     process.exit(1);
//   } finally {
//     // Close database connection
//     await mongoose.connection.close();
//     console.log('📝 Database connection closed');
//     process.exit(0);
//   }
// };

// // CLI handling
// const command = process.argv[2];

// switch (command) {
//   case 'seed':
//     seedDatabase();
//     break;
//   case 'clear':
//     clearDatabase();
//     break;
//   default:
//     console.log('🌱 Vistagram Database Seeding Tool');
//     console.log('');
//     console.log('Usage:');
//     console.log('  node scripts/seedData.js seed   - Seed database with sample posts');
//     console.log('  node scripts/seedData.js clear  - Clear all posts and seed images');
//     console.log('');
//     console.log('Examples:');
//     console.log('  npm run seed                    - If you have a script in package.json');
//     console.log('  node scripts/seedData.js seed   - Direct execution');
//     process.exit(1);
// }
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const Post = require('../models/Post');
const User = require('../models/User');

// Sample users for seeding
const seedUsers = [
  {
    username: "nature_wanderer",
    email: "nature.wanderer@email.com",
    password: "password123",
    displayName: "Nature Wanderer",
    bio: "Explorer of hidden trails and secret waterfalls. Finding magic in the wilderness.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: false,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    username: "architecture_lover",
    email: "arch.lover@email.com", 
    password: "password123",
    displayName: "Architecture Lover",
    bio: "Passionate about Victorian houses and urban design. Every building tells a story.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: true,
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    username: "market_explorer",
    email: "market.explorer@email.com",
    password: "password123", 
    displayName: "Market Explorer",
    bio: "Weekend market enthusiast. Love discovering fresh produce and local artisans.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: false,
    lastLogin: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    username: "golden_hour_chaser",
    email: "golden.hour@email.com",
    password: "password123",
    displayName: "Golden Hour Chaser", 
    bio: "Sunset photographer and beach lover. Chasing light across the bay area.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: true,
    lastLogin: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    username: "tech_explorer",
    email: "tech.explorer@email.com",
    password: "password123",
    displayName: "Tech Explorer",
    bio: "Science and innovation enthusiast. Love exploring museums and learning new things.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: false,
    lastLogin: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    username: "bridge_enthusiast",
    email: "bridge.fan@email.com",
    password: "password123",
    displayName: "Bridge Enthusiast",
    bio: "Engineering marvels fascinate me. Walking the Golden Gate never gets old.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: true,
    lastLogin: new Date(Date.now() - 20 * 60 * 1000)
  },
  {
    username: "neighborhood_walker",
    email: "neighborhood.walker@email.com",
    password: "password123",
    displayName: "Neighborhood Walker",
    bio: "Urban explorer discovering the cultural treasures of SF neighborhoods.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: false,
    lastLogin: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    username: "park_lover",
    email: "park.lover@email.com",
    password: "password123",
    displayName: "Park Lover",
    bio: "Outdoor enthusiast and picnic planner. SF parks are my second home.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: false,
    lastLogin: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    username: "fishermans_wharf_fan", 
    email: "wharf.fan@email.com",
    password: "password123",
    displayName: "Fisherman's Wharf Fan",
    bio: "Wildlife photographer specializing in marine life. Love the sea lions at Pier 39.",
    avatar: null,
    followers: [],
    following: [],
    postsCount: 1,
    role: "user",
    isActive: true,
    isVerified: true,
    lastLogin: new Date(Date.now() - 3 * 60 * 1000)
  }
];

// Sample data for seeding posts
const seedPosts = [
  {
    username: "nature_wanderer",
    image: "seed7.jpg",
    caption: "Hidden gem alert! Found this secret waterfall trail in Marin County. Sometimes the best adventures are off the beaten path 💧 #waterfall #marin #hiking #hiddengem #adventure",
    likes: 145,
    shares: 34,
    likedBy: ['user_fgh890', 'user_ijk123', 'user_lmn456'],
    location: {
      name: "Marin County",
      coordinates: [-122.7633, 38.0834]
    },
    tags: ['waterfall', 'marin', 'hiking', 'hiddengem', 'adventure'],
    isActive: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    username: "architecture_lover",
    image: "seed8.jpg",
    caption: "The Victorian painted ladies on Alamo Square are architectural poetry! Each house tells its own story 🏠 #victorian #alamosquare #architecture #paintedladies #history",
    likes: 112,
    shares: 19,
    likedBy: ['user_opq789', 'user_rst012'],
    location: {
      name: "Alamo Square Park",
      coordinates: [-122.4335, 37.7766]
    },
    tags: ['victorian', 'alamosquare', 'architecture', 'paintedladies', 'history'],
    isActive: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
  },
  {
    username: "market_explorer",
    image: "seed9.jpg",
    caption: "Saturday vibes at Ferry Building Marketplace! Fresh produce, artisanal goods, and the best energy in the city 🥬 #ferrybuilding #farmersmarket #fresh #saturday #local",
    likes: 98,
    shares: 28,
    likedBy: ['user_uvw345', 'user_xyz678', 'user_abc901'],
    location: {
      name: "Ferry Building Marketplace",
      coordinates: [-122.3938, 37.7956]
    },
    tags: ['ferrybuilding', 'farmersmarket', 'fresh', 'saturday', 'local'],
    isActive: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    username: "golden_hour_chaser",
    image: "seed10.jpg",
    caption: "Another spectacular sunset at Baker Beach with the Golden Gate Bridge as the perfect backdrop! Never gets old 🌅 #bakerbeach #goldengatebridge #sunset #spectacular #goldengate",
    likes: 189,
    shares: 42,
    likedBy: ['user_def234', 'user_ghi567', 'user_jkl890', 'user_mno123'],
    location: {
      name: "Baker Beach",
      coordinates: [-122.4843, 37.7938]
    },
    tags: ['bakerbeach', 'goldengatebridge', 'sunset', 'spectacular', 'goldengate'],
    isActive: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    username: "tech_explorer",
    image: "seed11.jpg",
    caption: "Exploring the innovation at the Exploratorium! Science and art coming together in the most beautiful way 🔬 #exploratorium #science #innovation #learning #pier15",
    likes: 76,
    shares: 15,
    likedBy: ['user_pqr456', 'user_stu789'],
    location: {
      name: "Exploratorium",
      coordinates: [-122.3979, 37.8010]
    },
    tags: ['exploratorium', 'science', 'innovation', 'learning', 'pier15'],
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    username: "bridge_enthusiast",
    image: "seed12.jpg",
    caption: "Walking across the Golden Gate Bridge never loses its magic! The engineering marvel and the views are unmatched 🌉 #goldengatebridge #walking #engineering #views #iconic",
    likes: 267,
    shares: 58,
    likedBy: ['user_vwx012', 'user_yza345', 'user_bcd678', 'user_efg901', 'user_hij234'],
    location: {
      name: "Golden Gate Bridge",
      coordinates: [-122.4786, 37.8199]
    },
    tags: ['goldengatebridge', 'walking', 'engineering', 'views', 'iconic'],
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    username: "neighborhood_walker",
    image: "seed13.jpg",
    caption: "Getting lost in the colorful streets of Chinatown! Every corner has a story and amazing food 🏮 #chinatown #culture #food #neighborhood #exploration",
    likes: 134,
    shares: 25,
    likedBy: ['user_klm567', 'user_nop890', 'user_qrs123'],
    location: {
      name: "Chinatown San Francisco",
      coordinates: [-122.4058, 37.7941]
    },
    tags: ['chinatown', 'culture', 'food', 'neighborhood', 'exploration'],
    isActive: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    username: "park_lover",
    image: "seed14.jpg",
    caption: "Perfect picnic spot at Dolores Park with amazing city views! San Francisco's outdoor living room 🌳 #dolorespark #picnic #cityviews #outdoor #community",
    likes: 87,
    shares: 16,
    likedBy: ['user_tuv456', 'user_wxy789'],
    location: {
      name: "Dolores Park",
      coordinates: [-122.4269, 37.7596]
    },
    tags: ['dolorespark', 'picnic', 'cityviews', 'outdoor', 'community'],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    username: "fishermans_wharf_fan",
    image: "seed15.jpg",
    caption: "Sea lions taking over Pier 39! Nature reclaiming the city in the most adorable way 🦭 #pier39 #sealions #wildlife #fishermanswharf #nature",
    likes: 198,
    shares: 37,
    likedBy: ['user_zab012', 'user_cde345', 'user_fgh678', 'user_ijk901'],
    location: {
      name: "Pier 39",
      coordinates: [-122.4096, 37.8086]
    },
    tags: ['pier39', 'sealions', 'wildlife', 'fishermanswharf', 'nature'],
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000)
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vistagram');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing posts and users');

    // Insert seed users first
    const insertedUsers = await User.insertMany(seedUsers);
    console.log(`✅ Successfully seeded ${insertedUsers.length} users`);

    // Insert seed posts
    const insertedPosts = await Post.insertMany(seedPosts);
    console.log(`✅ Successfully seeded ${insertedPosts.length} posts`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`• Total users: ${insertedUsers.length}`);
    console.log(`• Total posts: ${insertedPosts.length}`);
    console.log(`• Total likes: ${seedPosts.reduce((sum, post) => sum + post.likes, 0)}`);
    console.log(`• Total shares: ${seedPosts.reduce((sum, post) => sum + post.shares, 0)}`);
    console.log(`• Verified users: ${seedUsers.filter(user => user.isVerified).length}`);
    console.log(`• Total locations: ${seedPosts.filter(post => post.location).length}`);
    console.log(`• Total tags: ${[...new Set(seedPosts.flatMap(post => post.tags))].length}`);

    console.log('\n👥 Seeded Users:');
    insertedUsers.forEach(user => {
      console.log(`   • @${user.username} - ${user.displayName} ${user.isVerified ? '✓' : ''}`);
    });

    console.log('\n🔑 Login Credentials:');
    console.log('   • All users have password: "password123"');
    console.log('   • Example: username="nature_wanderer", password="password123"');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n🚀 You can now start your server and see the sample data!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
    process.exit(0);
  }
};

// Function to clear database
const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing database...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vistagram');
    console.log('✅ Connected to MongoDB');

    // Clear all data
    const postResult = await Post.deleteMany({});
    const userResult = await User.deleteMany({});
    
    console.log(`🗑️  Deleted ${postResult.deletedCount} posts`);
    console.log(`🗑️  Deleted ${userResult.deletedCount} users`);

    console.log('✅ Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
    process.exit(0);
  }
};

// CLI handling
const command = process.argv[2];

switch (command) {
  case 'seed':
    seedDatabase();
    break;
  case 'clear':
    clearDatabase();
    break;
  default:
    console.log('🌱 Vistagram Database Seeding Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/seedData.js seed   - Seed database with sample users and posts');
    console.log('  node scripts/seedData.js clear  - Clear all users and posts');
    console.log('');
    console.log('Examples:');
    console.log('  npm run seed                    - If you have a script in package.json');
    console.log('  node scripts/seedData.js seed   - Direct execution');
    process.exit(1);
}