"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exercises = [
    {
        muscle: 'Chest',
        exercises: [
            {
                name: 'Dumbbell bench press',
                equipment: 'Dumbbell'
            },
            {
                name: 'Pushups',
                equipment: 'Body'
            },
            {
                name: 'Dumbbell flies',
                equipment: 'Dumbbell'
            },
            {
                name: 'Incline dumbbell press',
                equipment: 'Dumbbell'
            },
            {
                name: 'Low cable crossover',
                equipment: 'Cable'
            },
            {
                name: 'Decline dumbbell flies',
                equipment: 'Dumbbell'
            },
            {
                name: 'Dips',
                equipment: 'Body'
            },
            {
                name: 'Incline cable flies',
                equipment: 'Cable'
            },
            {
                name: 'Decline barbell bench press',
                equipment: 'Barbell'
            },
            {
                name: 'Incline push-ups',
                equipment: 'Body'
            },
            {
                name: 'Incline dumbbell flies',
                equipment: 'Dumbbell'
            },
            {
                name: 'Cable crossover',
                equipment: 'Cable'
            },
            {
                name: 'Butterfly',
                equipment: 'Machine'
            },
            {
                name: 'Chest press',
                equipment: 'Machine'
            },
            {
                name: 'Incline chest press',
                equipment: 'Machine'
            },
            {
                name: 'Smith machine bench press',
                equipment: 'Machine'
            },
            {
                name: 'Smith machine incline bench press',
                equipment: 'Machine'
            },
            {
                name: 'Pullover dumbbell',
                equipment: 'Dumbbell'
            }
        ]
    },
    {
        muscle: 'Forearms',
        exercises: [
            {
                name: 'Rickshaw carry',
                equipment: 'Other'
            },
            {
                name: 'Wrist rotations barbell',
                equipment: 'Barbell'
            },
            {
                name: 'Palms-down wrist curl',
                equipment: 'Barbell'
            },
            {
                name: 'Palms-up wrist curl',
                equipment: 'Barbell'
            },
            {
                name: 'Farmer\'s walk',
                equipment: 'Other'
            },
            {
                name: 'Fingers curl',
                equipment: 'Barbell'
            },
            {
                name: 'Seated pulley wrist curl',
                equipment: 'Cable'
            }
        ]
    },
    {
        muscle: 'Lats',
        exercises: [
            {
                name: 'Shotgun row',
                equipment: 'Cable'
            },
            {
                name: 'Pull-up',
                equipment: 'Body'
            },
            {
                name: 'Chin-up',
                equipment: 'Body'
            },
            {
                name: 'Close-grip front lat pull-down',
                equipment: 'Cable'
            }
        ]
    },
    {
        muscle: 'Middle back',
        exercises: [
            {
                name: 'T-Bar row',
                equipment: 'Barbell'
            },
            {
                name: 'Reverse grip bent over rows',
                equipment: 'Barbell'
            },
            {
                name: 'One-arm dumbbell row',
                equipment: 'Dumbbell'
            },
            {
                name: 'Dumbbell incline row',
                equipment: 'Dumbbell'
            },
            {
                name: 'Seated cable rows',
                equipment: 'Cable'
            },
            {
                name: 'Bent over barbell row',
                equipment: 'Barbell'
            },
            {
                name: 'Yates row',
                equipment: 'Barbell'
            },
            {
                name: 'Pendlay row',
                equipment: 'Barbell'
            },
            {
                name: 'Smith machine bent over row',
                equipment: 'Machine'
            }
        ]
    },
    {
        muscle: 'Lower back',
        exercises: [
            {
                name: 'Deadlift',
                equipment: 'Barbell'
            },
            {
                name: 'Rack pull',
                equipment: 'Barbell'
            },
            {
                name: 'Superman',
                equipment: 'Body'
            },
            {
                name: 'Seated back extension',
                equipment: 'Machine'
            },
            {
                name: 'Seated good mornings',
                equipment: 'Barbell'
            }
        ]
    },
    {
        muscle: 'Quadriceps',
        exercises: [
            {
                name: 'Romanian deadlift with dumbbells',
                equipment: 'Dumbbell'
            },
            {
                name: 'Clean deadlift',
                equipment: 'Barbell'
            },
            {
                name: 'Barbell deadlift',
                equipment: 'Barbell'
            },
            {
                name: 'Sumo deadlift',
                equipment: 'Barbell'
            },
            {
                name: 'Lying leg curls',
                equipment: 'Machine'
            },
            {
                name: 'Power clean',
                equipment: 'Barbell'
            },
            {
                name: 'Good morning',
                equipment: 'Barbell'
            },
            {
                name: 'Romanian deadlift',
                equipment: 'Barbell'
            }
        ]
    },
    {
        muscle: 'Calves',
        exercises: [
            {
                name: 'Smith machine calf raise',
                equipment: 'Machine'
            },
            {
                name: 'Standing calf raises',
                equipment: 'Machine'
            },
            {
                name: 'Standing dumbbell calf raise',
                equipment: 'Dumbbell'
            },
            {
                name: 'Seated calf raise',
                equipment: 'Machine'
            },
            {
                name: 'Rocking standing calf raise',
                equipment: 'Barbell'
            },
            {
                name: 'Calf press on the leg press machine',
                equipment: 'Machine'
            },
            {
                name: 'Calf press',
                equipment: 'Machine'
            },
            {
                name: 'Standing barbell calf raise',
                equipment: 'Barbell'
            },
            {
                name: 'Barbell seated calf raise',
                equipment: 'Barbell'
            }
        ]
    },
    {
        muscle: 'Triceps',
        exercises: [
            {
                name: 'Dips - triceps version',
                equipment: 'Body'
            },
            {
                name: 'Decline EZ bar triceps extension',
                equipment: 'Barbell'
            },
            {
                name: 'Close-grip barbell bench press',
                equipment: 'Barbell'
            },
            {
                name: 'Triceps pushdown - V-bar attachment',
                equipment: 'Cable'
            },
            {
                name: 'Kneeling cable triceps extension',
                equipment: 'Cable'
            },
            {
                name: 'Reverse grip triceps pushdown',
                equipment: 'Cable'
            },
            {
                name: 'Standing dumbbell triceps extension',
                equipment: 'Dumbbell'
            },
            {
                name: 'Push-ups - Close triceps position',
                equipment: 'Body'
            },
            {
                name: 'EZ-bar skullcrusher',
                equipment: 'EZ curl bar'
            },
            {
                name: 'Triceps pushdown - Rope attachment',
                equipment: 'Cable'
            },
            {
                name: 'Cable one arm tricep extension',
                equipment: 'Cable'
            },
            {
                name: 'Decline close-grip bench to skull crusher',
                equipment: 'Barbell'
            },
            {
                name: 'Seated triceps press',
                equipment: 'Dumbbell'
            },
            {
                name: 'Incline barbell triceps extension',
                equipment: 'Barbell'
            },
            {
                name: 'Close-grip EZ-bar press',
                equipment: 'EZ curl bar'
            },
            {
                name: 'Dip machine',
                equipment: 'Machine'
            },
            {
                name: 'Tricep dumbbell kickback',
                equipment: 'Dumbbell'
            },
            {
                name: 'Dumbbell one-arm triceps extension',
                equipment: 'Dumbbell'
            },
            {
                name: 'Standing one-arm dumbbell triceps extension',
                equipment: 'Dumbbell'
            }
        ]
    },
    {
        muscle: 'Traps',
        exercises: [
            {
                name: 'Smith machine shrug',
                equipment: 'Machine'
            },
            {
                name: 'Dumbbell shrug',
                equipment: 'Dumbbell'
            },
            {
                name: 'Calf-machine shoulder shrug',
                equipment: 'Machine'
            },
            {
                name: 'Barbell shrug',
                equipment: 'Barbell'
            },
            {
                name: 'Barbell shrug behind the back',
                equipment: 'Barbell'
            },
            {
                name: 'Upright cable row',
                equipment: 'Cable'
            },
            {
                name: 'Cable shrugs',
                equipment: 'Cable'
            }
        ]
    },
    {
        muscle: 'Shoulders',
        exercises: [
            {
                name: 'Single-arm linear jammer',
                equipment: 'Barbell'
            },
            {
                name: 'Side laterals to front raise',
                equipment: 'Dumbbell'
            },
            {
                name: 'Standing palm-in one-arm dumbbell press',
                equipment: 'Dumbbell'
            },
            {
                name: 'Push press',
                equipment: 'Barbell'
            },
            {
                name: 'Standing military press',
                equipment: 'Barbell'
            },
            {
                name: 'One-arm kettlebell push press',
                equipment: 'Kettlebells'
            },
            {
                name: 'Seated barbell military press',
                equipment: 'Barbell'
            },
            {
                name: 'Reverse flyes',
                equipment: 'Dumbbell'
            },
            {
                name: 'Seated dumbbell press',
                equipment: 'Dumbbell'
            },
            {
                name: 'Standing dumbbell press',
                equipment: 'Dumbbell'
            },
            {
                name: 'Front dumbbell raise',
                equipment: ' Dumbbell'
            },
            {
                name: 'Arnold dumbbell press',
                equipment: 'Dumbbell'
            },
            {
                name: 'Front plate raise',
                equipment: 'Other'
            },
            {
                name: 'Front two-dumbbell raise',
                equipment: 'Dumbbell'
            },
            {
                name: 'Front cable raise',
                equipment: 'Cable'
            },
            {
                name: 'Barbell shoulder press',
                equipment: 'Barbell'
            },
            {
                name: 'External rotation with cable',
                equipment: 'Cable'
            },
            {
                name: 'Barbell shoulder press',
                equipment: 'Barbell'
            },
            {
                name: 'Face pull',
                equipment: 'Cable'
            }
        ]
    },
    {
        muscle: 'Abdominals',
        exercises: [
            {
                name: 'Plank',
                equipment: 'Body'
            },
            {
                name: 'Bottoms up',
                equipment: 'Body'
            },
            {
                name: 'Spider crawl',
                equipment: 'Body'
            },
            {
                name: 'Cross-body crunch',
                equipment: 'Body'
            },
            {
                name: 'Plate twist',
                equipment: 'Other'
            },
            {
                name: 'Decline crunch',
                equipment: 'Body'
            },
            {
                name: 'Cable crunch',
                equipment: 'Cable'
            },
            {
                name: 'Hanging leg raise',
                equipment: 'Body'
            },
            {
                name: 'Ab roller',
                equipment: 'Other'
            },
            {
                name: 'Weighted crunches',
                equipment: 'Body'
            },
            {
                name: 'Dumbbell side bend',
                equipment: 'Dumbbell'
            },
            {
                name: 'Decline oblique crunch',
                equipment: 'Body'
            },
            {
                name: 'Ab crunch machine',
                equipment: 'Machine'
            }
        ]
    },
    {
        muscle: 'Glutes',
        exercises: [
            {
                name: 'Barbell glute bridge',
                equipment: 'Barbell'
            },
            {
                name: 'Barbell hip thrust',
                equipment: 'Barbell'
            },
            {
                name: 'One-legged cable kickback',
                equipment: 'Cable'
            },
            {
                name: 'Kneeling squat',
                equipment: 'Barbell'
            },
            {
                name: 'Glute kickback',
                equipment: 'Body'
            },
            {
                name: 'Flutter kicks',
                equipment: 'Body'
            },
            {
                name: 'Leg lift',
                equipment: 'Body'
            }
        ]
    },
    {
        muscle: 'Biceps',
        exercises: [
            {
                name: 'Incline hammer curls',
                equipment: 'Dumbbell'
            },
            {
                name: 'Wide-grip standing barbell curl',
                equipment: 'Barbell'
            },
            {
                name: 'Spider curl',
                equipment: 'EZ Curl Bar'
            },
            {
                name: 'EZ-Bar curl',
                equipment: 'EZ Curl Bar'
            },
            {
                name: 'Hammer curls',
                equipment: 'Dumbbell'
            },
            {
                name: 'Zottman curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'Concentration curls',
                equipment: 'Dumbbell'
            },
            {
                name: 'Barbell curl',
                equipment: 'Barbell'
            },
            {
                name: 'Overhead cable curl',
                equipment: 'Cable'
            },
            {
                name: 'Machine bicep curl',
                equipment: 'Machine'
            },
            {
                name: 'Dumbbell bicep curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'Cross body hammer curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'Close-grip EZ bar curl',
                equipment: 'EZ Curl Bar'
            },
            {
                name: 'Reverse barbell preacher curls',
                equipment: 'EZ Curl Bar'
            },
            {
                name: 'Preacher curl',
                equipment: 'Barbell'
            },
            {
                name: 'Standing one-arm cable curl',
                equipment: 'Cable'
            },
            {
                name: 'Seated close-grip concentration barbell curl',
                equipment: 'Barbell'
            },
            {
                name: 'Alternate incline dumbbell curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'Dumbbell alternate biceps curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'One arm dumbbell preacher curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'Standing concentration curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'Alternate hammer curl',
                equipment: 'Dumbbell'
            },
            {
                name: 'Standing biceps cable curl',
                equipment: 'Cable'
            }
        ]
    },
    {
        muscle: 'Adductors',
        exercises: [
            {
                name: 'Thigh adductor',
                equipment: 'Machine'
            },
            {
                name: 'Side leg raises',
                equipment: 'Body'
            },
            {
                name: 'Lying bent leg groin',
                equipment: 'Other'
            },
            {
                name: 'Lateral cone hops',
                equipment: 'Other'
            }
        ]
    },
    {
        muscle: 'Abductors',
        exercises: [
            {
                name: 'Standing hip circles',
                equipment: 'Body'
            },
            {
                name: 'Thigh abductor',
                equipment: 'Machine'
            },
            {
                name: 'Windmills',
                equipment: 'Body'
            },
            {
                name: 'IT band and glute stretch',
                equipment: 'Other'
            },
            {
                name: 'Lateral band walk',
                equipment: 'Bands'
            }
        ]
    }
];
exports.default = exercises;
// https://www.bodybuilding.com/exercises/finder/?muscleid=17
//# sourceMappingURL=exercises.js.map