import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { apiService } from "@/services/api/apiService";

const APICatalogPage = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [expandedApi, setExpandedApi] = useState(null);

  const categories = [
    { value: "All", label: "All APIs", icon: "Database", count: 0 },
    { value: "Social", label: "Social", icon: "Users", count: 0 },
    { value: "Analytics", label: "Analytics", icon: "BarChart3", count: 0 },
    { value: "Content", label: "Content", icon: "FileText", count: 0 },
    { value: "E-commerce", label: "E-commerce", icon: "ShoppingCart", count: 0 },
    { value: "Data", label: "Data", icon: "Database", count: 0 },
    { value: "Utility", label: "Utility", icon: "Settings", count: 0 }
  ];

  useEffect(() => {
    loadApis();
  }, []);

  const loadApis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAll();
      setApis(data);
      toast.success(`Loaded ${data.length} APIs successfully! 🚀`);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load API catalog");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedApis = useMemo(() => {
    let filtered = apis;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(api =>
        api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        api.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        api.growthHackRecipe.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(api => api.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "impact":
          return b.impactScore - a.impactScore;
        case "leverage":
          return b.leverageScore - a.leverageScore;
        case "novelty":
          return b.noveltyScore - a.noveltyScore;
        default:
          return 0;
      }
    });

    return filtered;
  }, [apis, searchTerm, selectedCategory, sortBy]);

  // Update category counts
  const categoriesWithCounts = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: cat.value === "All" 
        ? apis.length 
        : apis.filter(api => api.category === cat.value).length
    }));
  }, [apis]);

  const getCategoryVariant = (category) => {
    const variants = {
      Social: "primary",
      Analytics: "secondary", 
      Content: "accent",
      "E-commerce": "success",
      Data: "info",
      Utility: "warning"
    };
    return variants[category] || "primary";
  };

  const getCodeTemplate = (api) => {
    if (api.codePointer === "Python") {
      return `# ${api.name} API Integration
import requests

def use_${api.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_api():
    url = "${api.endpoint}"
    headers = {"Authorization": "Bearer YOUR_API_KEY"}
    
    response = requests.get(url, headers=headers)
    data = response.json()
    
    # ${api.growthHackRecipe}
    return data`;
    } else {
      return `// ${api.name} API Integration
const use${api.name.replace(/[^a-zA-Z0-9]/g, '')}Api = async () => {
  const response = await fetch('${api.endpoint}', {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  const data = await response.json();
  
  // ${api.growthHackRecipe}
  return data;
};`;
    }
  };

  const copyToClipboard = async (text, apiName) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Code copied for ${apiName}! 📋`);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadApis} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            API Growth Catalog 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover 500 high-impact APIs for growth hacking, marketing automation, and creative workflows
          </p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search APIs, use cases, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categoriesWithCounts.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name={category.icon} size={16} />
                  {category.label}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: "name", label: "Name" },
                { value: "impact", label: "Impact" },
                { value: "leverage", label: "Leverage" },
                { value: "novelty", label: "Novelty" }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "info" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredAndSortedApis.length} of {apis.length} APIs
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSortBy("name");
                toast.info("Filters cleared! 🔄");
              }}
            >
              <ApperIcon name="X" size={16} className="mr-1" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* API Grid */}
      {filteredAndSortedApis.length === 0 ? (
        <Empty
          type="default"
          title="No APIs found 🔍"
          message="Try adjusting your search or filter criteria"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAndSortedApis.map((api, index) => (
              <motion.div
                key={api.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  variant="hover"
                  className="h-full flex flex-col"
                  onClick={() => setExpandedApi(expandedApi === api.Id ? null : api.Id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {api.name}
                        </h3>
                        <Badge variant={getCategoryVariant(api.category)}>
                          {api.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {api.description}
                      </p>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="flex justify-between mb-4 text-xs">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-primary">{api.impactScore}</span>
                      <span className="text-gray-500">Impact</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-secondary">{api.leverageScore}</span>
                      <span className="text-gray-500">Leverage</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-accent">{api.noveltyScore}</span>
                      <span className="text-gray-500">Novelty</span>
                    </div>
                  </div>

                  {/* Growth Hack Recipe */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <ApperIcon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">Growth Hack</p>
                        <p className="text-sm text-gray-700">{api.growthHackRecipe}</p>
                      </div>
                    </div>
                  </div>

                  {/* Data Types */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {api.dataTypes.map((type, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedApi === api.Id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t pt-4 mt-4"
                      >
                        <div className="space-y-4">
                          {/* Code Template */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <ApperIcon name="Code" size={16} />
                                {api.codePointer} Template
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(getCodeTemplate(api), api.name);
                                }}
                              >
                                <ApperIcon name="Copy" size={14} />
                              </Button>
                            </div>
                            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                              <code>{getCodeTemplate(api)}</code>
                            </pre>
                          </div>

                          {/* API Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-semibold text-gray-700">Endpoint:</span>
                              <p className="text-blue-600 break-all">{api.endpoint}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Rate Limit:</span>
                              <p className="text-gray-600">{api.rateLimit}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(api.documentation, '_blank');
                      }}
                    >
                      <ApperIcon name="ExternalLink" size={14} className="mr-1" />
                      Docs
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedApi(expandedApi === api.Id ? null : api.Id);
                      }}
                    >
                      <ApperIcon 
                        name={expandedApi === api.Id ? "ChevronUp" : "ChevronDown"} 
                        size={16} 
                      />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Button
          variant="primary"
          size="icon"
          className="w-14 h-14 rounded-full shadow-2xl"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast.info("Back to top! 🚀");
          }}
        >
          <ApperIcon name="ArrowUp" size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default APICatalogPage;