import { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';

/**
 * Component for selecting league seasons
 * 
 * @param {Array} leagues - Array of leagues to select from
 * @param {string|number} value - Currently selected season ID
 * @param {Function} onChange - Callback when selection changes
 * @param {boolean} showLeague - Whether to show league name in options
 * @param {string} placeholder - Custom placeholder text
 * @param {boolean} loading - Whether the component is loading data
 * @param {Object} style - Additional styles for the select component
 */
const LeagueSeasonSelect = ({ 
    leagues = [], 
    value, 
    onChange, 
    showLeague = true, 
    placeholder = "Select a season", 
    loading = false,
    style = {} 
}) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (leagues && leagues.length > 0) {
            const newOptions = [];
            leagues.forEach(league => {
                if (league.leagueSeasons && league.leagueSeasons.length > 0) {
                    league.leagueSeasons.forEach(season => {
                        newOptions.push({
                            value: season.id,
                            label: showLeague 
                                ? `${league.name} - ${season.startYear}/${season.endYear}` 
                                : `${season.startYear}/${season.endYear}`
                        });
                    });
                }
            });
            setOptions(newOptions);
        }
    }, [leagues, showLeague]);

    return (
        <Select
            placeholder={placeholder}
            style={{ width: 200, ...style }}
            value={value}
            onChange={(value) => onChange(value)}
            options={options}
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : null}
            showSearch
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
        />
    );
};

LeagueSeasonSelect.propTypes = {
    leagues: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    showLeague: PropTypes.bool,
    placeholder: PropTypes.string,
    loading: PropTypes.bool,
    style: PropTypes.object
};

export default LeagueSeasonSelect;