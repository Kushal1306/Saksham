import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import {
  LineChart, Line, PieChart, Pie, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, Cell, BarChart, Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart as PieIcon, Radio} from "lucide-react";
import axios from 'axios';
import StylishLoading from '@/components/StylishLoading';

const generateRatings = (feedbackData) => {
  if (!feedbackData) return [];
  
  return [
    { 
      name: 'Technical', 
      value: feedbackData.technical.rating, 
      color: '#3b82f6',
      feedback: feedbackData.technical.feedback,
      strength: feedbackData.technical.strength,
      improvement: feedbackData.technical.improvement
    },
    { 
      name: 'Communication', 
      value: feedbackData.communication.rating, 
      color: '#22c55e',
      feedback: feedbackData.communication.feedback,
      strength: feedbackData.communication.strength,
      improvement: feedbackData.communication.improvement
    },
    { 
      name: 'Behavioral', 
      value: feedbackData.behavioral.rating, 
      color: '#f59e0b',
      feedback: feedbackData.behavioral.feedback,
      strength:feedbackData.behavioral.strength,
      improvement:feedbackData.behavioral.improvement
    },
    { 
      name: 'Overall', 
      value: feedbackData.overall.rating, 
      color: '#8b5cf6',
      feedback: feedbackData.overall.feedback,
      strength:feedbackData.overall.strength,
      improvement: feedbackData.overall.improvement
    }
  ];
};

const Feedback = () => {
  const [selectedChart, setSelectedChart] = useState('radar');
  const [userfeedback,setUserFeedback]=useState(null);
  const [isLoading,setIsLoading]=useState(false);
  const [ratings, setRatings] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const interviewId = queryParams.get('interviewId');

  useEffect(()=>{
        const getCandidateFeedBack=async(interviewId)=>{
          console.log("intervieod",interviewId);
          setIsLoading(true);
              try {
                const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feedback/${interviewId}`);
                // console.log("the response is:",response.data.feedBack);
                if(response.data){
                  // console.log("parameters:",response.data.feedBack.parameters);
                  setUserFeedback(response.data.feedBack.parameters)
                  const newRatings = generateRatings(response.data.feedBack.parameters);
                  setRatings(newRatings);
                }
      
              } catch (error) {
                console.log("error occured:",error.message);
              }
              finally{
                setIsLoading(false)
              }
        }
        if(interviewId){
          getCandidateFeedBack(interviewId);
        }
  },[interviewId]);


//  let ratings=null;
//    useEffect(()=>{
           
//    },[isLoading])
//   ratings = [
//     { 
//       name: 'Technical', 
//       value: userfeedback.technical.rating, 
//       color: '#3b82f6',
//       feedback: userfeedback.technical.feedback,
//       strength: 'Frontend development, React.js',
//       improvement: 'Backend integration, Express.js'
//     },
//     { 
//       name: 'Communication', 
//       value: userfeedback.communication.rating, 
//       color: '#22c55e',
//       feedback: userfeedback.communication.feedback,
//       strength: 'Clear articulation and confidence',
//       improvement: 'Continue maintaining direct communication'
//     },
//     { 
//       name: 'Behavioral', 
//       value: userfeedback.behavioral.rating, 
//       color: '#f59e0b',
//       feedback:userfeedback.behavioral.feedback,
//       strength: 'Teamwork and adaptability',
//       improvement: 'More proactive problem-solving'
//     },
//     { 
//       name: 'Overall', 
//       value:userfeedback.overall.rating, 
//       color: '#8b5cf6',
//       feedback:userfeedback.overall.feedback,
//       strength: 'Strong frontend development fit',
//       improvement: 'Backend skills and proactive attitude'
//     }
//   ];

  const benchmarkValue = 7; // 7/10 as baseline

  // Chart data preparations
  // const radarData = ratings.map(item => ({
  //   subject: item.name,
  //   value: item.value,
  //   benchmark: benchmarkValue
  // }));

  // const lineData = ratings.map(item => ({
  //   category: item.name,
  //   rating: item.value,
  //   benchmark: benchmarkValue
  // }));
  const radarData = useMemo(() => {
    if (!ratings.length) return [];
    return ratings.map(item => ({
      subject: item.name,
      value: item.value,
      benchmark: benchmarkValue
    }));
  }, [ratings]);
  
  const lineData = useMemo(() => {
    if (!ratings.length) return [];
    return ratings.map(item => ({
      category: item.name,
      rating: item.value,
      benchmark: benchmarkValue
    }));
  }, [ratings]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = ratings.find(item => item.name === label || item.name === payload[0].name);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-600">Score: {data.value}/10</p>
          <div className="mt-2 max-w-sm">
            <p className="text-sm text-gray-600">{data.feedback}</p>
            <div className="mt-2">
              <p className="text-green-600 text-sm flex items-center">
                <span className="mr-2">✓</span> {data.strength}
              </p>
              <p className="text-amber-600 text-sm flex items-center">
                <span className="mr-2">△</span> {data.improvement}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return (
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis dataKey="category" />
            <YAxis domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="rating" 
              name="Score"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="benchmark" 
              name="Benchmark"
              stroke="#94a3b8" 
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={ratings}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({name, value}) => `${name}: ${value}/10`}
            >
              {ratings.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        );
      
      case 'radar':
        return (
          <RadarChart outerRadius={120} data={radarData}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} ticks={[2,4,6,8,10]} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Radar
              name="Benchmark"
              dataKey="benchmark"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.3}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        );

      case 'bar':
        return (
          <BarChart data={ratings}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Score"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            >
              {ratings.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        );
      
      default:
        return null;
    }
  };

  const chartButtons = [
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'pie', label: 'Pie', icon: PieIcon },
    { id: 'radar', label: 'Radar', icon: Radio },
    { id: 'bar', label: 'Bar', icon: Radio},
  ];

  return (
    <div>
      {isLoading ?(
        <StylishLoading/>
      ):(
        <div className="space-y-6 p-6 bg-gray-50">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Interview Assessment</CardTitle>
              <p className="text-gray-500 mt-1">Candidate Performance Analysis</p>
            </div>
            <div className="flex space-x-2">
              {chartButtons.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedChart(id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    selectedChart === id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {ratings.map((rating) => (
                <Card key={rating.name} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: rating.color }}>{rating.name}</h3>
                      <p className="text-gray-600 mt-1 text-sm">{rating.feedback}</p>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: rating.color }}>
                      {rating.value}/10
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-green-600 text-sm flex items-center">
                      <span className="mr-2">✓</span> {rating.strength}
                    </p>
                    <p className="text-amber-600 text-sm flex items-center">
                      <span className="mr-2">△</span> {rating.improvement}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      )
      }
    </div>
  );
};

export default Feedback;