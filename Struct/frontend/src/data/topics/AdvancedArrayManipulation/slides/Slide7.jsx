import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartBar, FaReact, FaDatabase, FaBrain, 
  FaFileAlt, FaCheckCircle, FaMobileAlt, FaArrowRight,
  FaLightbulb, FaExternalLinkAlt, FaCode
} from 'react-icons/fa';

const Slide7 = () => {
  const [activeTab, setActiveTab] = useState('data-analytics');
  const [expandedCase, setExpandedCase] = useState(null);
  const [demoState, setDemoState] = useState({
    demoData: [
      { id: 1, name: "Alex", score: 85 },
      { id: 2, name: "Bailey", score: 92 },
      { id: 3, name: "Casey", score: 78 },
      { id: 4, name: "Dana", score: 95 },
      { id: 5, name: "Elliot", score: 88 },
    ],
    filterThreshold: 85,
    sortDirection: "desc",
    groupBy: "none",
    selectedIds: []
  });
  
  // Live demo functions
  const handleFilterChange = (threshold) => {
    setDemoState({...demoState, filterThreshold: threshold});
  };
  
  const handleSortChange = (direction) => {
    setDemoState({...demoState, sortDirection: direction});
  };
  
  const handleGroupByChange = (groupBy) => {
    setDemoState({...demoState, groupBy});
  };
  
  const handleCheckboxChange = (id) => {
    const newSelected = demoState.selectedIds.includes(id)
      ? demoState.selectedIds.filter(item => item !== id)
      : [...demoState.selectedIds, id];
    
    setDemoState({...demoState, selectedIds: newSelected});
  };
  
  // Process the demo data based on current state
  const processedData = () => {
    let result = [...demoState.demoData];
    
    // Apply filter
    if (demoState.filterThreshold > 0) {
      result = result.filter(item => item.score >= demoState.filterThreshold);
    }
    
    // Apply sort
    if (demoState.sortDirection === "asc") {
      result.sort((a, b) => a.score - b.score);
    } else if (demoState.sortDirection === "desc") {
      result.sort((a, b) => b.score - a.score);
    }
    
    // Apply grouping
    if (demoState.groupBy === "grade") {
      const grouped = result.reduce((acc, student) => {
        const grade = student.score >= 90 ? 'A' : 
                     student.score >= 80 ? 'B' : 
                     student.score >= 70 ? 'C' : 'D';
        
        if (!acc[grade]) {
          acc[grade] = [];
        }
        acc[grade].push(student);
        return acc;
      }, {});
      
      return grouped;
    }
    
    return result;
  };
  
  // Generate code snippets based on current state
  const generateCodeSnippet = () => {
    let code = 'const students = [\n';
    code += '  { id: 1, name: "Alex", score: 85 },\n';
    code += '  { id: 2, name: "Bailey", score: 92 },\n';
    code += '  { id: 3, name: "Casey", score: 78 },\n';
    code += '  { id: 4, name: "Dana", score: 95 },\n';
    code += '  { id: 5, name: "Elliot", score: 88 }\n';
    code += '];\n\n';
    
    if (demoState.filterThreshold > 0) {
      code += `// Filter students with scores >= ${demoState.filterThreshold}\n`;
      code += `const filtered = students.filter(student => student.score >= ${demoState.filterThreshold});\n\n`;
    }
    
    if (demoState.sortDirection !== "none") {
      code += `// Sort students by score (${demoState.sortDirection === "asc" ? "ascending" : "descending"})\n`;
      code += `const sorted = filtered.sort((a, b) => ${demoState.sortDirection === "asc" ? 
        "a.score - b.score" : 
        "b.score - a.score"});\n\n`;
    }
    
    if (demoState.groupBy === "grade") {
      code += `// Group students by grade\n`;
      code += `const grouped = sorted.reduce((acc, student) => {
  const grade = student.score >= 90 ? 'A' : 
              student.score >= 80 ? 'B' : 
              student.score >= 70 ? 'C' : 'D';
  
  if (!acc[grade]) {
    acc[grade] = [];
  }
  acc[grade].push(student);
  return acc;
}, {});\n\n`;
    }
    
    if (demoState.selectedIds.length > 0) {
      code += `// Get selected students\n`;
      code += `const selectedIds = [${demoState.selectedIds.join(", ")}];\n`;
      code += `const selectedStudents = students.filter(student => selectedIds.includes(student.id));\n`;
    }
    
    return code;
  };

  // Case studies data
  const caseStudies = {
    'data-analytics': [
      {
        id: 'finance',
        title: 'Financial Data Analysis',
        description: 'Investment firm processing millions of stock transactions daily to identify patterns and anomalies.',
        challenge: 'Need to process large volumes of time-series data, detect patterns, and generate real-time insights.',
        solution: 'Used array methods like map, filter, and reduce combined with grouping techniques to analyze transaction patterns and identify outliers.',
        code: `// Group transactions by stock symbol and calculate metrics
const stockMetrics = transactions.reduce((acc, transaction) => {
  const { symbol, price, volume } = transaction;
  
  if (!acc[symbol]) {
    acc[symbol] = { volumes: [], prices: [], totalVolume: 0 };
  }
  
  acc[symbol].volumes.push(volume);
  acc[symbol].prices.push(price);
  acc[symbol].totalVolume += volume;
  
  return acc;
}, {});

// Find volatile stocks (high standard deviation in price)
const volatileStocks = Object.entries(stockMetrics)
  .map(([symbol, data]) => {
    const avg = data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length;
    const variance = data.prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / data.prices.length;
    return { 
      symbol, 
      volatility: Math.sqrt(variance),
      avgPrice: avg,
      totalVolume: data.totalVolume
    };
  })
  .filter(stock => stock.volatility > thresholdVolatility)
  .sort((a, b) => b.volatility - a.volatility);`,
        result: 'Reduced analysis time from hours to seconds and improved anomaly detection by 40%. Real-time dashboards now flag suspicious trading patterns immediately.'
      },
      {
        id: 'ecommerce',
        title: 'E-commerce Product Recommendations',
        description: 'Online retailer using purchase history to generate personalized product recommendations.',
        challenge: 'Need to analyze millions of customer purchases and generate relevant product recommendations quickly.',
        solution: 'Implemented collaborative filtering using array manipulation to identify purchase patterns and similarity scores.',
        code: `// Find users with similar purchase histories
function findSimilarUsers(targetUserId, purchaseHistory) {
  const targetUser = purchaseHistory.find(user => user.id === targetUserId);
  
  return purchaseHistory
    .filter(user => user.id !== targetUserId)
    .map(user => {
      // Find products both users purchased
      const commonProducts = user.purchases
        .filter(product => targetUser.purchases
          .some(p => p.productId === product.productId));
      
      return {
        userId: user.id,
        similarity: commonProducts.length / 
          Math.sqrt(user.purchases.length * targetUser.purchases.length),
        uniquePurchases: user.purchases
          .filter(product => !targetUser.purchases
            .some(p => p.productId === product.productId))
      };
    })
    .filter(user => user.similarity > 0.2)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10);
}

// Generate recommendations based on similar users
function generateRecommendations(similarUsers) {
  return similarUsers
    .flatMap(user => user.uniquePurchases.map(purchase => ({
      productId: purchase.productId,
      score: purchase.rating * user.similarity
    })))
    .reduce((acc, item) => {
      const existing = acc.find(p => p.productId === item.productId);
      
      if (existing) {
        existing.score = (existing.score + item.score) / 2;
      } else {
        acc.push(item);
      }
      
      return acc;
    }, [])
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}`,
        result: 'Increased conversion rate by 32% and average order value by 18% through highly relevant product recommendations. Reduced recommendation generation time by 75%.'
      }
    ],
    'frontend': [
      {
        id: 'state-management',
        title: 'React Performance Optimization',
        description: 'E-commerce dashboard with complex product filtering and cart management.',
        challenge: 'Users experienced slow UI updates when filtering and sorting products or managing items in their shopping cart.',
        solution: 'Used immutable array operations to optimize component rendering and reduce unnecessary re-renders.',
        code: `// Before: Mutating arrays (causes extra re-renders)
function addToCart(product) {
  const cart = this.state.cart;
  cart.push(product);
  this.setState({ cart });
}

function removeFromCart(productId) {
  const cart = this.state.cart;
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
  }
  this.setState({ cart });
}

// After: Immutable array operations
function addToCart(product) {
  this.setState(prevState => ({
    cart: [...prevState.cart, product]
  }));
}

function removeFromCart(productId) {
  this.setState(prevState => ({
    cart: prevState.cart.filter(item => item.id !== productId)
  }));
}

// Optimizing product filtering with useMemo
const filteredProducts = React.useMemo(() => {
  return products
    .filter(product => {
      return product.price >= priceRange[0] && 
             product.price <= priceRange[1] &&
             (!selectedCategory || product.category === selectedCategory);
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
}, [products, priceRange, selectedCategory, sortBy]);`,
        result: 'Reduced update time by 60%, eliminated UI freezing during operations, and improved user experience. Page load time decreased by 45% for product listings.'
      },
      {
        id: 'data-visualization',
        title: 'Interactive Data Visualization Dashboard',
        description: 'Healthcare analytics platform visualizing patient data across multiple dimensions.',
        challenge: 'Need to transform complex, nested patient data for visualization in charts and interactive exploration.',
        solution: 'Implemented transform pipelines using array methods to prepare data for different visualization components.',
        code: `// Transform patient records for visualization
function prepareChartData(patientRecords) {
  // Group by age range
  const ageGroups = patientRecords.reduce((groups, patient) => {
    const ageGroup = Math.floor(patient.age / 10) * 10;
    const key = \`\${ageGroup}-\${ageGroup + 9}\`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(patient);
    return groups;
  }, {});
  
  // Calculate metrics for each group
  return Object.entries(ageGroups).map(([groupName, patients]) => {
    const diabeticCount = patients.filter(p => p.conditions.includes('diabetes')).length;
    const hypertensiveCount = patients.filter(p => p.conditions.includes('hypertension')).length;
    
    return {
      ageGroup: groupName,
      totalPatients: patients.length,
      diabeticPercentage: (diabeticCount / patients.length) * 100,
      hypertensivePercentage: (hypertensiveCount / patients.length) * 100,
      avgBMI: patients.reduce((sum, p) => sum + p.bmi, 0) / patients.length
    };
  });
}

// Create time-series data for longitudinal analysis
const vitalTrends = patientRecords
  .filter(patient => patient.visits.length >= 3)
  .map(patient => {
    return {
      patientId: patient.id,
      bloodPressureTrend: patient.visits.map(visit => ({
        date: visit.date,
        systolic: visit.vitals.bloodPressure.systolic,
        diastolic: visit.vitals.bloodPressure.diastolic
      })),
      glucoseTrend: patient.visits.map(visit => ({
        date: visit.date,
        level: visit.vitals.glucoseLevel
      }))
    };
  });`,
        result: 'Enabled clinicians to identify at-risk patient populations with 85% accuracy. Reduced data preparation time from minutes to milliseconds, enabling real-time dashboard updates.'
      }
    ],
    'machine-learning': [
      {
        id: 'feature-engineering',
        title: 'Feature Engineering for Predictive Maintenance',
        description: 'Manufacturing company using sensor data to predict equipment failures.',
        challenge: 'Need to transform raw time-series sensor data into meaningful features for ML models.',
        solution: 'Created array transformation pipelines to extract statistical features from sensor readings.',
        code: `// Extract features from sensor time series data
function extractFeatures(sensorReadings) {
  return sensorReadings.map(machine => {
    // Group readings by sensor type
    const sensorGroups = machine.readings.reduce((acc, reading) => {
      if (!acc[reading.sensorType]) {
        acc[reading.sensorType] = [];
      }
      acc[reading.sensorType].push(reading.value);
      return acc;
    }, {});
    
    // Extract statistical features for each sensor
    const features = Object.entries(sensorGroups).flatMap(([sensorType, values]) => {
      // Calculate basic statistics
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const sortedValues = [...values].sort((a, b) => a - b);
      const median = sortedValues[Math.floor(values.length / 2)];
      
      // Calculate variance and standard deviation
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      // Get min, max, range
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;
      
      // Calculate trend (slope of linear regression)
      const n = values.length;
      const indices = Array.from({ length: n }, (_, i) => i);
      const sumX = indices.reduce((sum, i) => sum + i, 0);
      const sumY = values.reduce((sum, val) => sum + val, 0);
      const sumXY = indices.reduce((sum, i) => sum + i * values[i], 0);
      const sumXSquare = indices.reduce((sum, i) => sum + i * i, 0);
      const slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX * sumX);
      
      return [
        { name: \`\${sensorType}_mean\`, value: mean },
        { name: \`\${sensorType}_median\`, value: median },
        { name: \`\${sensorType}_std_dev\`, value: stdDev },
        { name: \`\${sensorType}_range\`, value: range },
        { name: \`\${sensorType}_trend\`, value: slope }
      ];
    });
    
    // Convert to feature object
    return {
      machineId: machine.id,
      features: features.reduce((obj, feature) => {
        obj[feature.name] = feature.value;
        return obj;
      }, {})
    };
  });
}`,
        result: 'Reduced false positives in failure prediction by 67%. Early detection of equipment failures saves $2.4M annually in prevented downtime.'
      },
      {
        id: 'data-processing',
        title: 'Efficient Data Processing for NLP Models',
        description: 'Customer service AI that analyzes support tickets to automate responses.',
        challenge: 'Need to process and normalize large volumes of text data for training language models.',
        solution: 'Built a text processing pipeline using array operations for efficient tokenization and normalization.',
        code: `// Process support tickets for NLP training
function processTickets(tickets) {
  return tickets
    // Extract text and metadata
    .map(ticket => ({
      id: ticket.id,
      text: ticket.description + ' ' + ticket.customerMessages.join(' '),
      category: ticket.category,
      priority: ticket.priority,
      resolved: ticket.status === 'resolved'
    }))
    // Clean and normalize text
    .map(ticket => ({
      ...ticket,
      tokens: tokenize(ticket.text)
    }))
    // Filter out tickets with insufficient content
    .filter(ticket => ticket.tokens.length > 10)
    // Create feature vectors
    .map(ticket => {
      // Count word frequencies
      const wordFrequency = ticket.tokens.reduce((freq, token) => {
        freq[token] = (freq[token] || 0) + 1;
        return freq;
      }, {});
      
      // Calculate TF-IDF features
      const features = Object.entries(wordFrequency).map(([token, count]) => {
        const tf = count / ticket.tokens.length;
        const idf = Math.log(
          tickets.length / 
          tickets.filter(t => t.tokens.includes(token)).length
        );
        return {
          token,
          tfidf: tf * idf
        };
      });
      
      return {
        id: ticket.id,
        category: ticket.category,
        priority: ticket.priority,
        resolved: ticket.resolved,
        features: features.sort((a, b) => b.tfidf - a.tfidf).slice(0, 100)
      };
    });
}

// Tokenize and normalize text
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(token => token.length > 2)
    .filter(token => !stopWords.includes(token))
    .map(token => stemmer(token));
}`,
        result: 'Improved response accuracy by 45% and reduced processing time for new tickets by 78%. System now handles 65% of routine support queries without human intervention.'
      }
    ]
  };

  return (
    <div className="p-4 bg-gradient-to-b from-blue-50 to-white">
      <h2 className="text-2xl font-bold text-blue-800 mb-3">
        Real-World Applications of Advanced Array Manipulation
      </h2>

      <p className="text-gray-600 mb-6">
        See how array manipulation powers modern applications across industries, from data analytics to machine learning.
      </p>

      {/* Interactive Demo */}
      <div className="bg-white p-5 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <FaLightbulb className="mr-2 text-yellow-500" /> 
          Interactive Array Operations Demo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter students by minimum score:
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={demoState.filterThreshold}
              onChange={(e) => handleFilterChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-center text-gray-500">
              {demoState.filterThreshold > 0 ? `≥ ${demoState.filterThreshold}` : 'No Filter'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by score:
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSortChange('asc')}
                className={`px-3 py-1 text-sm rounded flex-1 ${
                  demoState.sortDirection === 'asc' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ascending
              </button>
              <button
                onClick={() => handleSortChange('desc')}
                className={`px-3 py-1 text-sm rounded flex-1 ${
                  demoState.sortDirection === 'desc' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Descending
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group by:
            </label>
            <select
              value={demoState.groupBy}
              onChange={(e) => handleGroupByChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
            >
              <option value="none">No Grouping</option>
              <option value="grade">Grade (A/B/C/D)</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Results:</h4>
            
            {demoState.groupBy === "grade" ? (
              <div className="space-y-3">
                {Object.entries(processedData()).map(([grade, students]) => (
                  <div key={grade} className="border rounded-md overflow-hidden">
                    <div className={`text-white px-3 py-1 font-medium text-sm
                      ${grade === 'A' ? 'bg-green-500' : 
                        grade === 'B' ? 'bg-blue-500' : 
                        grade === 'C' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      Grade {grade}
                    </div>
                    <div className="p-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-600">
                            <th className="px-2 py-1">Select</th>
                            <th className="px-2 py-1">Name</th>
                            <th className="px-2 py-1">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map(student => (
                            <tr key={student.id} className="border-t">
                              <td className="px-2 py-1">
                                <input 
                                  type="checkbox" 
                                  checked={demoState.selectedIds.includes(student.id)}
                                  onChange={() => handleCheckboxChange(student.id)}
                                />
                              </td>
                              <td className="px-2 py-1">{student.name}</td>
                              <td className="px-2 py-1">{student.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-3 py-2 border">Select</th>
                    <th className="px-3 py-2 border">ID</th>
                    <th className="px-3 py-2 border">Name</th>
                    <th className="px-3 py-2 border">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData().map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">
                        <input 
                          type="checkbox" 
                          checked={demoState.selectedIds.includes(student.id)}
                          onChange={() => handleCheckboxChange(student.id)}
                        />
                      </td>
                      <td className="px-3 py-2 border">{student.id}</td>
                      <td className="px-3 py-2 border">{student.name}</td>
                      <td className="px-3 py-2 border">{student.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Generated Code:</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs overflow-auto max-h-72">
              <code>{generateCodeSnippet()}</code>
            </pre>
          </div>
        </div>
      </div>
      
      {/* Application Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('data-analytics')}
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'data-analytics' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaChartBar className="mr-2" /> Data Analytics
          </button>
          <button
            onClick={() => setActiveTab('frontend')}
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'frontend' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaReact className="mr-2" /> Frontend Development
          </button>
          <button
            onClick={() => setActiveTab('machine-learning')}
            className={`py-2 px-4 font-medium text-sm flex items-center ${
              activeTab === 'machine-learning' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaBrain className="mr-2" /> Machine Learning
          </button>
        </nav>
      </div>
      
      {/* Case Studies for the active tab */}
      <div className="space-y-6">
        {caseStudies[activeTab].map(caseStudy => (
          <motion.div 
            key={caseStudy.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {caseStudy.title}
              </h3>
              
              <p className="text-gray-600 mb-3">
                {caseStudy.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="bg-orange-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-orange-700 mb-1">Challenge</h4>
                  <p className="text-sm text-orange-600">
                    {caseStudy.challenge}
                  </p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-green-700 mb-1">Solution</h4>
                  <p className="text-sm text-green-600">
                    {caseStudy.solution}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setExpandedCase(expandedCase === caseStudy.id ? null : caseStudy.id)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                {expandedCase === caseStudy.id ? 'Hide Details' : 'Show Implementation'} 
                <FaArrowRight className={`ml-1 transform transition-transform ${expandedCase === caseStudy.id ? 'rotate-90' : ''}`} />
              </button>
            </div>
            
            {expandedCase === caseStudy.id && (
              <div className="border-t">
                <div className="p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaCode className="mr-2" /> Implementation
                  </h4>
                  
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs overflow-auto">
                    <code>{caseStudy.code}</code>
                  </pre>
                </div>
                
                <div className="bg-blue-50 p-4 border-t">
                  <h4 className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                    <FaCheckCircle className="mr-2" /> Results
                  </h4>
                  <p className="text-sm text-blue-600">
                    {caseStudy.result}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Additional Resources */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">
          Further Resources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-md border hover:shadow-md transition-shadow flex items-center"
          >
            <FaFileAlt className="text-blue-500 mr-3 text-xl" />
            <div>
              <div className="font-medium text-gray-800">MDN Array Documentation</div>
              <div className="text-xs text-gray-500 mt-1">Comprehensive reference for array methods</div>
            </div>
            <FaExternalLinkAlt className="ml-auto text-gray-400" />
          </a>
          
          <a 
            href="https://reactjs.org/docs/hooks-reference.html#usememo"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-md border hover:shadow-md transition-shadow flex items-center"
          >
            <FaReact className="text-blue-500 mr-3 text-xl" />
            <div>
              <div className="font-medium text-gray-800">React Performance Optimization</div>
              <div className="text-xs text-gray-500 mt-1">Learn about memoization and efficient rendering</div>
            </div>
            <FaExternalLinkAlt className="ml-auto text-gray-400" />
          </a>
          
          <a 
            href="https://www.tensorflow.org/js/guide/layers_for_keras_users"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-md border hover:shadow-md transition-shadow flex items-center"
          >
            <FaBrain className="text-blue-500 mr-3 text-xl" />
            <div>
              <div className="font-medium text-gray-800">TensorFlow.js Data Processing</div>
              <div className="text-xs text-gray-500 mt-1">Working with tensor arrays for ML</div>
            </div>
            <FaExternalLinkAlt className="ml-auto text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Slide7;