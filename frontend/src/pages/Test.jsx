import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CloudFog } from 'lucide-react';

const DealDetailsForm = () => {
    const { dealId } = useParams();
    const [dealDetails, setDealDetails] = useState(null);
    const [items, setItems] = useState([]);
    console.log(dealId);

    // Dummy data for testing
    // const dummyData = {
    //     success: true,
    //     message: "Deal details retrieved successfully",
    //     details: {
    //         deal_id: 25,
    //         pop_id: 9,
    //         organization_id: null,
    //         contact_id: 1,
    //         subject: "xyz",
    //         reference: "PO #9 - Supplier 1",
    //         requested_date: null,
    //         valid_upto: null,
    //         same_pickup_location: false,
    //         status: "Pending",
    //         terms_and_conditions: null,
    //         attached_files: [],
    //         notes: null,
    //         createdAt: "2024-10-30T10:07:06.140Z",
    //         updatedAt: "2024-10-30T10:07:06.140Z",
    //         requested_by: null,
    //         tpoItemMetaDetails: [
    //             {
    //                 deal_id: 25,
    //                 pop_id: 9,
    //                 item_id: 3,
    //                 qty_ordered: 15,
    //                 qty_available: null,
    //                 pickup_date: null,
    //                 pickup_loc: null,
    //                 item: {
    //                     item_code: "12345568",
    //                     item_name: "Iron"
    //                 }
    //             },
    //             {
    //                 deal_id: 25,
    //                 pop_id: 9,
    //                 item_id: 4,
    //                 qty_ordered: 10,
    //                 qty_available: null,
    //                 pickup_date: null,
    //                 pickup_loc: null,
    //                 item: {
    //                     item_code: "67683872",
    //                     item_name: "Steel"
    //                 }
    //             },
    //             {
    //                 deal_id: 25,
    //                 pop_id: 9,
    //                 item_id: 6,
    //                 qty_ordered: 4,
    //                 qty_available: null,
    //                 pickup_date: null,
    //                 pickup_loc: null,
    //                 item: {
    //                     item_code: "63873749",
    //                     item_name: "Aluminium"
    //                 }
    //             }
    //         ]
    //     }
    // };

    useEffect(() => {
        // Initialize with dummy data instead of fetching from API
        const getDealData = async (deal_id) => {
            try {
                const response = await axios.get(`http://localhost:3000/po/trade/${deal_id}`);
                console.log(response.data);
                if (response.data.success) {
                    setDealDetails(response.data.details);
                    setItems(response.data.details.tpoItemMetaDetails);
                } else {
                    console.error(response.data.message);
                }

            } catch (error) {
                console.log("error ocurred:",error.message);
            }
        }
        getDealData(dealId);
    }, []);

    // Update item details
    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value; // Update the relevant field in the item
        setItems(updatedItems);
    };

    const handleSave = async () => {
        console.log(items);
        const data= {
            updatedData: {
                status: "Approved", 
            },
            items: items.map(item => ({
                deal_id: item.deal_id,
                pop_id: item.pop_id,
                item_id: item.item_id,
                qty_ordered: item.qty_ordered,
                qty_available: Number(item.qty_available),
                unit_rate: item.unit_rate, 
                amount:item.amount
            }))
        };
        console.log(data);

        try {
            const response = await axios.patch(`http://localhost:3000/po/update/${dealId}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = response.data;
            if (result.success) {
                alert("Details saved successfully!");
                console.log("details:",result.details);
            } else {
                alert("Error saving details: " );
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    if (!dealDetails) {
        return <div className="text-center">Loading deal details...</div>;
    }
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50 shadow-lg rounded-lg">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Deal Details</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <p className="text-lg text-gray-700"><strong>PO ID:</strong> {dealDetails.pop_id}</p>
                <p className="text-lg text-gray-700"><strong>Reference:</strong> {dealDetails.reference}</p>
                <p className="text-lg text-gray-700"><strong>Subject:</strong> {dealDetails.subject}</p>
                <p className="text-lg text-gray-700"><strong>Requested By:</strong> {dealDetails.requested_by || 'N/A'}</p>
            </div>
    
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Item Details</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-100 text-gray-700">
                        <th className="py-3 px-4 border-b font-medium text-left">Item Name</th>
                        <th className="py-3 px-4 border-b font-medium text-left">Ordered Quantity</th>
                        <th className="py-3 px-4 border-b font-medium text-left">Available Quantity</th>
                        <th className="py-3 px-4 border-b font-medium text-left">Unit Rate</th>
                        <th className="py-3 px-4 border-b font-medium text-left">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.item_id} className="hover:bg-blue-50">
                            <td className="py-3 px-4 border-b text-gray-800">{item.item.item_name}</td>
                            <td className="py-3 px-4 border-b text-gray-800">{item.qty_ordered}</td>
                            <td className="py-3 px-4 border-b">
                                <input
                                    type="number"
                                    placeholder="Available Quantity"
                                    value={item.qty_available || ''}
                                    onChange={(e) => handleInputChange(index, 'qty_available', e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-400 focus:ring focus:ring-blue-200"
                                />
                            </td>
                            <td className="py-3 px-4 border-b">
                                <input
                                    type="text"
                                    placeholder="Enter Rate"
                                    value={item.unit_rate|| ''}
                                    onChange={(e) => handleInputChange(index, 'unit_rate', e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-400 focus:ring focus:ring-blue-200"
                                />
                            </td>
                            <td className="py-3 px-4 border-b">
                                <input
                                    type="text"
                                    placeholder="Enter Amount"
                                    value={item.amount ||''}
                                    onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-400 focus:ring focus:ring-blue-200"
                                />
                            </td>
                       
                        </tr>
                    ))}
                </tbody>
            </table>
    
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
    
};

export default DealDetailsForm;
